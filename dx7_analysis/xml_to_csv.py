import os
import csv
from lxml import etree

# Folder structure:
#DX7/
#├── syx/
#├── converted_xml/    ← contains your .xml files
#├── xml_to_csv.py     ← this file

# Run from inside DX7 folder:
# python xml_to_csv.py


def extract_patch_data(xml_file):
    tree = etree.parse(xml_file)
    root = tree.getroot()

    patch_data = []
    for patch in root.findall('Patch'):
        row = {
            "id": patch.get("id"),
            "name": patch.findtext("name", ""),
            "algorithm": patch.findtext("algorithm", ""),
        }

        for op_num in range(1, 7):
            op = patch.find(f"operator_{op_num}")
            if op is not None:
                for elem in op:
                    key = f"operator_{op_num}_{elem.tag}"
                    row[key] = elem.text

        patch_data.append(row)
    return patch_data

def xml_dir_to_csv(xml_dir, output_csv):
    all_patches = []

    for filename in os.listdir(xml_dir):
        if filename.endswith(".xml"):
            xml_path = os.path.join(xml_dir, filename)
            patches = extract_patch_data(xml_path)
            all_patches.extend(patches)

    if not all_patches:
        print("No patches found.")
        return

    # Write to CSV
    with open(output_csv, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=sorted(all_patches[0].keys()))
        writer.writeheader()
        writer.writerows(all_patches)

    print(f"Wrote {len(all_patches)} patches to {output_csv}")

if __name__ == "__main__":
    # Example usage:
    xml_input_dir = "converted_xml"         # or use full path like "../DX7/xml_output"
    csv_output_file = "dx7_patches.csv"  # customize if needed,

    xml_dir_to_csv(xml_input_dir, csv_output_file)