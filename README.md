# SoundGenerator
March - May 2025 <br>

Web-based Sound Generator that creates a downloadable cartridge <br>

## Built with: <br>
Backend: Python <br>
    -fastapi uvicorn
Frontend: React + JS <br>

## Installation: <br>
Needed:
Git
Node (created with  v22.14.0)
npm

Download this repo <br>
in frontend folder, in cmd run:<br>
'npm install', then 'npm run dev' <br>

## HOW TO USE <br>

**Open frontend:** <br>
in SoundGenerator/frontend  => npm install <br>
then: npm run dev <br>
follow link

**Backend portion is not usable at the moment** <br>
**Connect backend to frontend:** <br>
1 -open cmd in root, create venv(python -m venv venv) <br>
or activate it (venv\Scripts\activate) <br> 

2 -go to BACKEND dir <br>
NOTE this needs to be done only when first using venv or when req. has been updated!<br>
open cmd and run in venv: pip install -r requirements.txt
Updating append in backend dir terminal: pip freeze > requirements.txt

3 -in terminal: uvicorn api:app --reload <br>
OR if you know the port: <br>
uvicorn api:app --reload --port XXXX <br>

