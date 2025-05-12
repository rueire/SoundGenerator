import os
import csv
from lxml import etree

# -------------------------------------------------------------
# Tool that converts all the XML files (created by syx_to_xml_bulk.py) to a single CSV file.
# It scans all the folders in the current directory starting with "converted_xml_*",
# extracts patch data from each XML file, and writes the combined results to dx7_patches.csv.
# The script assumes that the XML files are in the format created by syx_to_xml_bulk.py, and that the folders retain their names created by the syx_to_xml_bulk.py script.
# -------------------------------------------------------------
# Requirements:
# - Python
# - lxml library for XML parsing.

# Install lxml with:
# pip install lxml

# Run the script with:
# python xml_to_csv_all.py
# -------------------------------------------------------------

# Function to extract patch data from a single XML file.
# It reads the XML file, extracts relevant patch parameters, and returns them as a list of dictionaries.
def extract_patch_data(xml_file, source_folder=""):
    tree = etree.parse(xml_file)
    root = tree.getroot()
    patch_data = []

    for patch in root.findall('Patch'):
        row = {}

        # First: id attribute from the Patch element.
        row["id"] = patch.get("id")

        # Then all top-level patch parameters in order of appearance.
        ordered_tags = [
            "name", "algorithm", "feedback", "oscillator_sync", "lfo_speed",
            "lfo_delay", "lfo_pm_depth", "lfo_am_depth", "pitch_mod_sensitivity",
            "lfo_waveform", "lfo_sync", "transpose",
            "pitch_eg_rate1", "pitch_eg_rate2", "pitch_eg_rate3", "pitch_eg_rate4",
            "pitch_eg_level1", "pitch_eg_level2", "pitch_eg_level3", "pitch_eg_level4"
        ]
        for tag in ordered_tags:
            row[tag] = patch.findtext(tag, "")

        # Extracts operator parameters: in order op6 to op1.
        for op_num in range(6, 0, -1):
            op = patch.find(f"operator_{op_num}")
            if op is not None:
                for elem in op:
                    key = f"operator_{op_num}_{elem.tag}"
                    row[key] = elem.text or ""

        # Adds source (the folder from where they came from).
        row["source"] = source_folder

        patch_data.append(row)

    return patch_data

# Function to scan directories for XML files, extract patch data, and write to a CSV file.
# It walks through the base directory, looking for folders that start with "converted_xml_",
# processes each XML file within those folders, and collects the patch data into a single CSV file.
def xml_dirs_to_csv(base_dir, output_csv):
    all_patches = []

    # Finds all folders starting with "converted_xml_" in the base directory.
    for root, dirs, files in os.walk(base_dir):
        for folder in dirs:
            if folder.startswith("converted_xml_"):
                full_path = os.path.join(root, folder)
                folder_patch_count = 0

                # Loops through all XML files in this folder.
                for filename in os.listdir(full_path):
                    if filename.endswith(".xml"):
                        xml_path = os.path.join(full_path, filename)
                        patches = extract_patch_data(xml_path, source_folder=folder)
                        all_patches.extend(patches)
                        folder_patch_count += len(patches)

                print(f"Processed folder '{folder}' — {folder_patch_count} patches added.")

    if not all_patches:
        print("No patches found.")
        return

    # Defines the order of fields for the CSV output.
    field_order = [
        "id", "name", "algorithm", "feedback", "oscillator_sync", "lfo_speed",
        "lfo_delay", "lfo_pm_depth", "lfo_am_depth", "pitch_mod_sensitivity",
        "lfo_waveform", "lfo_sync", "transpose",
        "pitch_eg_rate1", "pitch_eg_rate2", "pitch_eg_rate3", "pitch_eg_rate4",
        "pitch_eg_level1", "pitch_eg_level2", "pitch_eg_level3", "pitch_eg_level4"
    ]

    # Adds operator parameters in order from op6 to op1.
    for op_num in range(6, 0, -1):
        for param in [
            "eg_rate1", "eg_rate2", "eg_rate3", "eg_rate4",
            "eg_level1", "eg_level2", "eg_level3", "eg_level4",
            "key_scaling_break", "key_scaling_left_depth", "key_scaling_right_depth",
            "key_scaling_left_curve", "key_scaling_right_curve",
            "oscillator_detune", "rate_scaling",
            "key_velocity_sensitivity", "amp_mod_sensitivity",
            "output_level", "frequency_coarse", "oscillator_mode", "frequency_fine"
        ]:
            field_order.append(f"operator_{op_num}_{param}")

    # Adds the source field at the end.
    field_order.append("source")

    # Writes all patches to the CSV file.
    with open(output_csv, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=field_order)
        writer.writeheader()
        writer.writerows(all_patches)

    print(f"Finished! Wrote {len(all_patches)} patches to {output_csv}")

if __name__ == "__main__":
    base_directory = "."  # Looks for XML folders in the current directory
    output_file = "dx7_patches.csv"
    xml_dirs_to_csv(base_directory, output_file)