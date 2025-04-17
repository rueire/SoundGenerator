import os
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from syx_to_xml import syx_to_xml
# import syx_to_xml
# import xml_to_csv
import subprocess
import tempfile
# import shutil

# Set your project directory for saving the files (ensure this directory exists)
# UPLOAD_DIR = "syx-files"  # Change this to the desired directory in your project
XML_DIR = "xml-files"

# Ensure directory exist
# os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(XML_DIR, exist_ok=True)

app = FastAPI()

origins = [
    "http://localhost:5173",  #port frontend uses
]

    # CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           # Allow only your frontend (or use ["*"] for testing)
    allow_credentials=True,
    allow_methods=["*"],             # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],             # Allow all headers
)

@app.post("/api/uploadfile")

async def upload_syx_file(syxFile: UploadFile = File(...)):
    try:
        # Read file contents directly (in memory)
        contents = await syxFile.read()

       # Save the .syx content temporarily in memory using a NamedTemporaryFile
        with tempfile.NamedTemporaryFile(delete=False, suffix=".syx") as temp_syx_file:
            temp_syx_file.write(contents)
            temp_syx_file_path = temp_syx_file.name
        
        # Define the XML output path
        xml_output_path = os.path.join(XML_DIR, f"{os.path.basename(temp_syx_file_path)}.xml")

        # Open the temporary syx file as a file object
        with open(temp_syx_file_path, 'rb') as syx_file_obj:
            # Define the XML output path
            xml_output_path = os.path.join(XML_DIR, f"{os.path.basename(temp_syx_file_path)}.xml")
            
            # Open the XML output file in write mode
            with open(xml_output_path, 'w') as xml_file_obj:
                # Call the syx_to_xml function with file objects
                try:
                    syx_to_xml(syx_file_obj, xml_file_obj)  # Pass file objects
                except Exception as e:
                    return JSONResponse(status_code=500, content={"error": str(e)})

        # Remove the temporary .syx file
        os.remove(temp_syx_file_path)
        
        return JSONResponse(content={"message": "File uploaded and saved successfully"})
            
    except Exception as e:
        return JSONResponse(status_code=400, content={"message": str(e)})

    
    #  This saves the file, not needed?
    # try:
    #     # save file to server
    #     file_location = f"uploaded_files/{syxFile.filename}"
    #     with open(file_location, "wb") as buffer:
    #         shutil.copyfileobj(syxFile.file, buffer)

    #     return JSONResponse(content={"message": "File uploaded successfully", "file": file_location})
    # except Exception as e:
    #     return JSONResponse(status_code=400, content={"message": str(e)})

            # parsed_syx = syx_to_xml.parse_dx7_patch(contents)
        # cleaned_syx = syx_to_xml.clean_for_xml(parsed_syx)
        # syx_to_xml.syx_to_xml(cleaned_syx, 'converted_xml')
        # patch_data = xml_to_csv.extract_patch_data('converted_xml.xml')
        # xml_to_csv.xml_dir_to_csv(patch_data, 'output_csv')