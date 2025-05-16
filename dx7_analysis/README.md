# Instructions for data analysis <br>

In order to analyze SysEx-files, you have to convert them into XML-format, and then to CSV-format, by using the scripts in this folder. <br>
Use the scripts in this order:
1. syx_to_xml.py
2. xml_to_csv.py
3. analyze.py

## Syx to XML
This script converts Yamaha DX7 SysEx files into XML format.
It can handle both single .syx file or directories of .syx files.
It will create a new folder named "converted_xml" in the same directory as the input files.
The script will convert all .syx files in the specified directory into XML format.

Requirements:
- Python
- lxml library

Install lxml with: <br>
pip install lxml


You can run the script with any of these commands: <br>
- python syx_to_xml.py filename.syx <br>
It will create a .xml file with the same name. <br>

OR
- define a new filename for the xml: <br>
python syx_to_xml.py filename.syx new_filename.xml <br>

OR
- for a directory of SysEx files (MOST USEFUL): <br>
python syx_to_xml.py foldername

Easiest way is to have the syx directory in the same root as this app.

## XML to CSV
-------------------------------------------------------------
Tool that converts all the XML files (created by syx_to_xml_bulk.py) to a single CSV file.
It scans all the folders in the current directory starting with "converted_xml_*",
extracts patch data from each XML file, and writes the combined results to dx7_patches.csv.
The script assumes that the XML files are in the format created by syx_to_xml_bulk.py, and that the folders retain their names created by the syx_to_xml_bulk.py script.

Requirements:
- Python
- lxml library for XML parsing.

Install lxml with:
pip install lxml

Run the script with:
python xml_to_csv.py

## Analyze
-------------------------------------------------------------
This app analyzes Yamaha DX7 patch data extracted from .syx files and converted to CSV format.
It provides various analyses and visualizations of the data.

Install required libraries: <br>
pip install lxml pandas matplotlib

Run with: <br>
python analyze.py csvfile.csv

The app is designed to be run from the command line.
It takes a CSV file as input and generates various analyses and charts based on the data.
The CSV file should be created using xml_to_csv.py, so that the data extracted from DX7 patches are in correct order for this app.

The app provides a menu-driven interface for users to select different analyses to perform on the data.
The output of the analyses includes mostly visualizations (charts) that can be displayed and saved.
