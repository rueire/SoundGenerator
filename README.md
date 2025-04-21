# SoundGenerator
March - May 2025

Web-based Sound Generator that creates a downloadable cartridge <br>
.syx and XML usage to be done with Python <br>

## to-be Built with: <br>
Backend: Python <br>
    -fastapi uvicorn
Frontend: React + JS <br>
.syx Generator: Python <br>

## Installation: <br>
TBA <br>

## How to use IN DEVELOPMENT <br>
**Connect backend to frontend:** <br>
open cmd in root, create venv(python -m venv venv) <br>
or activate it (venv\Scripts\activate) <br> 

then go to BACKEND dir <br>
NOTE this needs to be done only when first using venv or when req. has been updated!<br>
open cmd and run in venv: pip install -r requirements.txt

then: uvicorn api:app --reload <br>
OR if you know the port: <br>
uvicorn api:app --reload --port XXXX <br>

**Open frontend:** <br>
in SoundGenerator/frontend  => npm install <br>
then: npm run dev <br>
follow link

