from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import shutil

app = FastAPI()

@app.post("/api/upload_syx")
async def upload_syx_file(syxFile: UploadFile = File(...)):
    try:
        # Tallennetaan tiedosto palvelimelle
        file_location = f"uploaded_files/{syxFile.filename}"
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(syxFile.file, buffer)

        return JSONResponse(content={"message": "File uploaded successfully", "file": file_location})
    except Exception as e:
        return JSONResponse(status_code=400, content={"message": str(e)})