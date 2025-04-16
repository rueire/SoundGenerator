from lxml import etree
import sys
import os

# Takes a directory of syx files and converts them into xml.


# ***
# Install lxml.
# Easiest way is to have the syx directory in the same root as this app.
# Run with:

# python syx_to_xml_bulk.py yoursyxdirectory
# also
# python syx_to_xml_bulk.py path/to/folder (didn't confirm if this actually works)

# It will create a folder (named converted_xml) inside the given syx directory.
# ***


def parse_dx7_patch(data):
    if len(data) != 128:
        raise ValueError(f"Unexpected patch size: {len(data)} bytes (expected 128).")

    # Extracts the parameters from the 128-byte DX7 patch.
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
        base = op * 17  # Each operator's data is 17 bytes long.

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
    # Removes invalid XML characters (like control characters, NULL bytes).
    if isinstance(text, str):
        return ''.join(ch for ch in text if ch.isprintable())  # Only printable characters are allowed.
    return str(text)  # For non-string values (like numbers, already safe).

def syx_to_xml(syx_file, xml_file):
    # Converts a DX7 Sysex (.syx) file into XML format.
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
        print("Usage:")
        print("For one file:")
        print("python syx_to_xml.py your_file.syx [output.xml]")
        print("OR")
        print("For a directory of files:")
        print("python syx_to_xml.py foldername")
        print("OR if the folder is not in the same root:")
        print("python syx_to_xml.py path/to/folder_with_syx_files")
        sys.exit(1)

    input_path = sys.argv[1]

    if os.path.isdir(input_path):
        # Creates an output folder.
        output_folder = os.path.join(input_path, "converted_xml")
        os.makedirs(output_folder, exist_ok=True)

        print(f"Batch converting all .syx files in folder: {input_path}")
        print(f"Output will be saved to: {output_folder}")

        # Handles a folder full of .syx files.
        for filename in os.listdir(input_path):
            if filename.lower().endswith(".syx"):
                syx_file = os.path.join(input_path, filename)
                base_name = os.path.splitext(filename)[0]
                xml_file = os.path.join(output_folder, base_name + ".xml")
                try:
                    syx_to_xml(syx_file, xml_file)
                except Exception as e:
                    print(f"Failed to convert {filename}: {e}")
    else:
        # Handles single file conversion.
        input_file = input_path
        output_file = sys.argv[2] if len(sys.argv) > 2 else input_file.replace(".syx", ".xml") # User can define a new name for the xml file with the second argument.
        syx_to_xml(input_file, output_file)
        print(f"Converted {input_file} to {output_file}")

if __name__ == "__main__":
    main()