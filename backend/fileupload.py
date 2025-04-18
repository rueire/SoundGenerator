from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from lxml import etree
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

@app.post("/api/uploadfile")

async def upload_syx_file(syxFile: UploadFile = File(...)):
    print("Receiving file:", syxFile.filename)
    try:
        print('read file works')
        # Read file contents directly (in memory)
        contents = await syxFile.read()

        # Access syx_to_xml.py
        try:
            syx_to_xml(contents, 'xml_file.xml')
        except Exception as e:
            print(f"Error while converting syx to xml: {e}")
        
        return JSONResponse(content={
            "message": "File parsed and converted successfully"
        })
                
    except Exception as e:
        return JSONResponse(status_code=400, content={"message": str(e)})