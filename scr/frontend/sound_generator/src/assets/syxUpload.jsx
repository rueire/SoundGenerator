import { useState } from "react";

function SyxUpload() {
    const [syxFile, setSyxFile] = useState(null);

    const receiveSyx = (event) => {
        //only use the first file received
        const file = event.target.files[0]
        if (file && file.name.endsWith('.syx')) {
            setSyxFile(file);
        } else {
            console.log('not a valid .syx file!')
            alert('not a valid .syx file!')
        }
    }

    // triggered when user presses Upload
    // Probably needs to be moved to SoundGenerator.jsx
    const handleSubmit = async () => {
        //if file doesnt exist, return
        if (!syxFile) return;

        //FormData is object in JS designed to easily handle file uploads.
        const formData = new FormData();
        formData.append('syx', syxFile);

        //Send to backend
        try {
            const response = await fetch('tähän laitetaan URL', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            console.log('Upload success:', result);
        } catch (err) {
            console.error('Upload failed:', err);
        }
    };
}