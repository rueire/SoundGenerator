from lxml import etree
import sys

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
    if len(data) != 128:
        raise ValueError(f"Unexpected patch size: {len(data)} bytes (expected 128)")

    name = data[118:128].decode('ascii', errors='ignore').strip()
    print(f"\n== Parsing patch: {name} ==")

    # Extracts parameters from the 128-byte DX7 patch.
    patch = {
        "name": data[118:128].decode('ascii', errors='ignore').strip(),
        "algorithm": (data[110] & 0b11111) + 1, # Range: 0-31, but in reality 1-32.  Algorithm is in bits 0–4 of byte 110.
        "feedback": data[111] & 0b111, # feedback is in bits 0–2 of byte 111. Range: 0-7
        "oscillator_sync": (data[111] >> 3) & 0b1,  # oscillator key sync is bit 3 of byte 111. Range: 0-1, ON/OFF?
        "lfo_speed": data[112], # 0-99
        "lfo_delay": data[113], # 0-99
        "lfo_pm_depth": data[114], # 0-99
        "lfo_am_depth": data[115], # 0-99

        # Byte 116: in order 76543210 LPMS (bits 6-4), LFW (bits 3-1), LKS (bit 0).
        "pitch_mod_sensitivity": (data[116] >> 4) & 0b00000111,  # bits 6-4. Range: 0–7
        "lfo_waveform": (data[116] >> 1) & 0b00000111,   # bits 3-1. Range is 0-5, 0:TRI (triangle), 1:SD (saw down), 2:SU (saw up), 3:SQ (square), 4:SINE (sine wave), 5:S/H (sample and hold).
        "lfo_sync": data[116] & 0b1,    # bit 0. Range 0-1, 0:OFF/1:ON
        "transpose": data[117], # 0-48, (+-2 octaves in manual. C2=12, C3=24)

        "pitch_eg_rate1": data[102], # 0-99
        "pitch_eg_rate2": data[103], # 0-99
        "pitch_eg_rate3": data[104], # 0-99
        "pitch_eg_rate4": data[105], # 0-99
        "pitch_eg_level1": data[106], # 0-99
        "pitch_eg_level2": data[107], # 0-99
        "pitch_eg_level3": data[108], # 0-99
        "pitch_eg_level4": data[109], # 0-99
    }

    # Operator parameters (DX7 has 6 operators).
    for op in range(6):
        base = op * 17  # Each operator's data is 17 bytes long.

        byte11 = data[base + 11]
        byte12 = data[base + 12]
        byte13 = data[base + 13]
        byte15 = data[base + 15]

        patch[f"operator_{6 - op}"] = {
            "eg_rate1": data[base + 0],     # 0-99
            "eg_rate2": data[base + 1],     # 0-99
            "eg_rate3": data[base + 2],     # 0-99
            "eg_rate4": data[base + 3],     # 0-99
            "eg_level1": data[base + 4],    # 0-99
            "eg_level2": data[base + 5],    # 0-99
            "eg_level3": data[base + 6],    # 0-99
            "eg_level4": data[base + 7],    # 0-99
            "key_scaling_break": data[base + 8],                # 0-99, (A1-C8)
            "key_scaling_left_depth": data[base + 9],           # 0-99
            "key_scaling_right_depth": data[base + 10],         # 0-99
            "key_scaling_left_curve": byte11 & 0b11,            # 0-3
            "key_scaling_right_curve": (byte11 >> 2) & 0b11,    # 0-3
            "oscillator_detune": (byte12 >> 3) & 0b11111,       # 0-14, 0: detune= -7 (this can be seen in the YamahaDx7 manual, where range is -7 ~ +7)
            "rate_scaling": byte12 & 0b111,                     # 0-7
            "key_velocity_sensitivity": (byte13 >> 2) & 0b111,  # 0-7
            "amp_mod_sensitivity": byte13 & 0b11,               # 0-3
            "output_level": data[base + 14],                    # 0-99
            "frequency_coarse": (byte15 >> 1) & 0b11111,        # 0-31  (0.5-31 according to manual)
            "oscillator_mode": byte15 & 0b1,                    # 0-1,   RATIO/FIXED
            "frequency_fine": data[base + 16],                  # 0-99
        }
    # Debugging:
    #b = data[116]
    #print(f"\n[DEBUG] Byte 116: {b:08b}")
    #print("  Extracted pitch_mod_sensitivity:", patch["pitch_mod_sensitivity"])
    #print("  Extracted lfo_waveform:", patch["lfo_waveform"])
    #print("  Extracted lfo_sync:", patch["lfo_sync"])

    return patch

def clean_for_xml(text):
    # Removes invalid XML characters (like control characters, NULL bytes).
    if isinstance(text, str):
        return ''.join(ch for ch in text if ch.isprintable())  # Only printable characters are allowed.
    return str(text)  # For non-string values (like numbers, already safe).

def syx_to_xml(syx_file, xml_file):
    # Converts a DX7 Sysex (.syx) file into an XML format.
    with open(syx_file, "rb") as f:
        full_syx_data = f.read()

    # Checks if the header is in correct form.
    if full_syx_data[:6] != b'\xF0\x43\x00\x09\x20\x00':
        raise ValueError("Invalid Sysex header: Expected Yamaha DX7 bulk header")

    # Checks if the syx file ends in a correct byte.
    if full_syx_data[-1] != 0xF7:
        print(f"Sysex file {syx_file} does not end with 0xF7. Found instead: {hex(full_syx_data[-1])}")
    else:
        print(f"Last byte of the file is correct: {hex(full_syx_data[-1])}")

    # Extracts just the patch data (assume 6-byte header + 4096 bytes data).
    patch_data_start = 6
    patch_data_end = patch_data_start + 4096

    # Checks the length of the syx file.
    if len(full_syx_data) < patch_data_end:
        raise ValueError(f"File too short to contain 32 patches: {len(full_syx_data)} bytes")

    syx_data = full_syx_data[patch_data_start:patch_data_end]  # Trims anything after 4096 bytes (if there is).

    print("Header bytes:", full_syx_data[:6])
    print("First patch starts at:", full_syx_data[6:14])

    root = etree.Element("DX7Patches")

    num_patches = 32  # DX7 bulk dump always has 32 patches.
    patch_size = 128

    for i in range(num_patches):
        start = i * patch_size
        end = start + patch_size
        patch_data = syx_data[start:end]

        if len(patch_data) != patch_size:
            print(f"Patch {i+1} has invalid size ({len(patch_data)} bytes), skipping.")
            continue

        patch_info = parse_dx7_patch(patch_data)

        print(f"Patch {i+1} name: {patch_info['name']}, algorithm: {patch_info['algorithm']}")

        # For debuggig problem with algorithms, may remove later:
        if patch_info["algorithm"] > 32:
            print(f"Patch {i+1} has invalid algorithm: {patch_info['algorithm']}")

        patch_element = etree.SubElement(root, "Patch", id=str(i + 1))

        for key, value in patch_info.items():
            if isinstance(value, dict):  # Operator parameters.
                op_element = etree.SubElement(patch_element, key)
                for op_key, op_value in value.items():
                    etree.SubElement(op_element, op_key).text = clean_for_xml(op_value)
            else:
                etree.SubElement(patch_element, key).text = clean_for_xml(value)

    # Pretty-print with lxml.
    pretty_xml = etree.tostring(root, pretty_print=True, xml_declaration=True, encoding="UTF-8")

    with open(xml_file, "wb") as f:
        f.write(pretty_xml)

    print(f"Converted {syx_file} to {xml_file} with pretty formatting.")

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