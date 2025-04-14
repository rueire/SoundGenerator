from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import shutil

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
        
        # Do something with `contents` here (e.g. parse the syx data)

        # For example: return size for testing
        size = len(contents)
        return JSONResponse(content={"message": "File received", "size": size})
    
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