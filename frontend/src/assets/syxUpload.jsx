import { useState } from "react";

// Upload .syx from user
// needed when backend is available
export default function SyxUpload({onFileUpload}) {
    //onFileUpload to SoundGenerator return when function is used
    const [uploadedSyx, setUploadedSyx] = useState(null);

    const chooseFile = (e) => {
        //take only 1 file from user
        const file = e.target.files[0];
        //check file ending. File needs to be .syx
        if (file && file.name.endsWith('.syx')) {
            setUploadedSyx(file);
            onFileUpload(file);
        } else {
            console.log('Not a syx file')
        }
    }
    return (
        <div>
            <input
                type="file"
                accept=".syx"
                onChange={chooseFile}
            />
        </div>
    );
}