import { useState } from "react";

// Upload .syx from user
export default function SyxUpload() {
    const [uploadedSyx, setUploadedSyx] = useState(null);

    const chooseFile = (e) => {
        const file = e.target.files[0];
        if (file && file.name.endsWith('.syx')) {
            setUploadedSyx(file);
            SyxUpload(file);
        } else {
            console.log('Not a dyx file')
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