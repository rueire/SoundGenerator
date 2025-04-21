from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from lxml import etree
import os
from syx_to_xml import syx_to_xml

app = FastAPI()

origins = [
    "http://localhost:5173",  #port frontend uses
    "http://127.0.0.1:8000 "
]

    # CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           # Allow only your frontend (or use ["*"] for testing)
    allow_credentials=True,
    allow_methods=["*"],             # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],             # Allow all headers
)

@app.post("/api/upload_syx_file")

async def upload_syx_file(syxFile: UploadFile = File(...)):

    print("Receiving file:", syxFile.filename)
    try:
        print('read file works')
        # Read file contents directly (in memory)
        contents = await syxFile.read()
        xml_name = name_counter("xml_file",".xml")

        # Access syx_to_xml.py
        try:
            # var that takes returned xml
            xml_file = syx_to_xml(contents, xml_name)
            # send to frontend
            return Response(content=xml_file, media_type="application/xml")


        except Exception as e:
            print(f"Error while converting syx to xml: {e}")
                
    except Exception as e:
        return JSONResponse(status_code=400, content={"message": str(e)})

def name_counter(base_name, file_type):
    counter = 1
    while True:
        counter += 1
        filename = f"{base_name}{counter}{file_type}"
        return filename