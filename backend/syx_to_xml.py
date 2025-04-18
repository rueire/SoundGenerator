from lxml import etree
import sys
import os

# ***
# Install lxml.
# Run with:

# python syx_to_xml.py filename.syx
# It will create a .xml file with the same name.

# OR
# define a new filename for the xml:
# python syx_to_xml.py filename.syx new_filename.xml
# ***

def parse_dx7_patch(data):

    print(f"Parsing patch of size {len(data)}")
    if len(data) != 128:
        raise ValueError(f"Unexpected patch size: {len(data)} bytes (expected 128)")

    # Extracts parameters from the 128-byte DX7 patch.
    patch = {
        "name": data[118:128].decode('ascii', errors='ignore').strip(),
        "algorithm": (data[110] & 0b11111) + 1, # 0-31, but in reality 1-32.  Algorithm is in bits 0–4 of byte 110.
        "feedback": data[111] & 0b111, # 0-7, feedback is in bits 0–2 of byte 111.
        "oscillator_sync": (data[111] >> 3) & 0b1,  # 0–1, oscillator key sync is bit 3 of byte 111.
        "lfo_speed": data[112],
        "lfo_delay": data[113],
        "lfo_pm_depth": data[114],
        "lfo_am_depth": data[115],
        # Byte 116: LPMS (bits 5–7), LFW (bits 1–4), LKS (bit 0).
        "pitch_mod_sensitivity": (data[116] >> 5) & 0b111,  # bits 5–7 → 0–7
        "lfo_waveform": (data[116] >> 1) & 0b1111,   # bits 1–4 → 0–5 used
        "lfo_sync": data[116] & 0b1,    # bit 0
        "transpose": data[117],
        "pitch_eg_rate1": data[102],
        "pitch_eg_rate2": data[103],
        "pitch_eg_rate3": data[104],
        "pitch_eg_rate4": data[105],
        "pitch_eg_level1": data[106],
        "pitch_eg_level2": data[107],
        "pitch_eg_level3": data[108],
        "pitch_eg_level4": data[109],
    }

    # Operator parameters (DX7 has 6 operators).
    for op in range(6):
        base = op * 17  # Each operator's data is 17 bytes long in bulk dump format.

        byte11 = data[base + 11]
        byte12 = data[base + 12]
        byte13 = data[base + 13]
        byte15 = data[base + 15]

        patch[f"operator_{6 - op}"] = {
            "eg_rate1": data[base + 0],
            "eg_rate2": data[base + 1],
            "eg_rate3": data[base + 2],
            "eg_rate4": data[base + 3],
            "eg_level1": data[base + 4],
            "eg_level2": data[base + 5],
            "eg_level3": data[base + 6],
            "eg_level4": data[base + 7],
            "key_scaling_break": data[base + 8],
            "key_scaling_left_depth": data[base + 9],
            "key_scaling_right_depth": data[base + 10],
            "key_scaling_left_curve": byte11 & 0b11,
            "key_scaling_right_curve": (byte11 >> 2) & 0b11,
            "oscillator_detune": (byte12 >> 3) & 0b11111,
            "rate_scaling": byte12 & 0b111,
            "key_velocity_sensitivity": (byte13 >> 2) & 0b111,
            "amp_mod_sensitivity": byte13 & 0b11,
            "output_level": data[base + 14],
            "frequency_coarse": (byte15 >> 1) & 0b11111,
            "oscillator_mode": byte15 & 0b1,
            "frequency_fine": data[base + 16],
        }

    return patch

def clean_for_xml(text):
    if not isinstance(text, str):
        try:
            text = str(text)  # Muutetaan esim. lista/dict stringiksi
        except Exception as e:
            print("Error converting to string:", e)
            return ""

    return ''.join(ch for ch in text if ch.isprintable())

def syx_to_xml(syx_data, xml_file):
    # Mihin kansioon tallennetaan
    output_dir = "xml_output"  # voit muuttaa tämän haluamaksesi
    os.makedirs(output_dir, exist_ok=True)  # Luo kansion, jos ei ole
    
    xml_path = os.path.join(output_dir, xml_file)

    # Muuntaa Sysex-tiedoston muistista XML-muotoon.
    if syx_data[0] != 0xF0 or syx_data[-1] != 0xF7:
        raise ValueError("Invalid Sysex file format")

    num_patches = 32  # DX7 bulk dump always has 32 patches/voices.
    patch_size = 128

    expected_total_length = 7 + num_patches * patch_size + 1  # 6-byte header + data + 0xF7

    if not len(syx_data) == expected_total_length:
        print(f"Warning: Sysex file too short ({len(syx_data)} bytes), expected at least {expected_total_length}.")
        return
    
    elif len(syx_data) == expected_total_length:
        print("Detected single-patch Sysex file")

    root = etree.Element("DX7Patches")

    for i in range(num_patches):
        start = 7 + i * patch_size
        end = start + patch_size
        patch_data = syx_data[start:end]

        if len(patch_data) != patch_size:
            print(f"Warning: Patch {i+1} has invalid size ({len(patch_data)} bytes), skipping.")
            continue

        patch_info = parse_dx7_patch(patch_data)

        print(f"Patch {i+1} name: {patch_info['name']}, algorithm: {patch_info['algorithm']}")

        # For debuggig problem with algorithms, may remove later:
        if patch_info["algorithm"] > 32:
            print(f"Patch {i+1} has invalid algorithm: {patch_info['algorithm']}")
        if not patch_info["name"] or not patch_info["name"][0].isalpha():
            print(f"Patch {i+1} has sus name: '{patch_info['name']}'")

        patch_element = etree.SubElement(root, "Patch", id=str(i + 1))

        for key, value in patch_info.items():
            if isinstance(value, dict):  # Operator parameters
                op_element = etree.SubElement(patch_element, key)
                for op_key, op_value in value.items():
                    etree.SubElement(op_element, op_key).text = clean_for_xml(op_value)
            else:
                etree.SubElement(patch_element, key).text = clean_for_xml(value)

    # Pretty-print with lxml.
    pretty_xml = etree.tostring(root, pretty_print=True, xml_declaration=True, encoding="UTF-8")

    with open(xml_path, "wb") as f:
        f.write(pretty_xml)

    print(f"Converted {syx_data} to {xml_file} with pretty formatting.")

def main():
    if len(sys.argv) < 2:
        print("How to use: python syx_to_xml1.py <input.syx> [output.xml]")
        sys.exit(1)

    input_file = sys.argv[1] # First argument is: .syx file
    output_file = sys.argv[2] if len(sys.argv) > 2 else input_file.replace(".syx", ".xml") # User can define a new name for the xml file with the second argument.

    syx_to_xml(input_file, output_file)
    print(f"Converted {input_file} to {output_file}")


if __name__ == "__main__":
    main()