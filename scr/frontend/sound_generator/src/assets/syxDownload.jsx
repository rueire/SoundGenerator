
import { useState } from "react";

function syxDownload() {
    const [downloadedSyx, setDownloadedSyx] = useState(false);

    // handleDownload requests backend
    const handleDownload = async () => {
        setDownloadedSyx(true);

        try {
            const response = await fetch('esimerkkinä: /api/generate_syx');
            if (!response.ok) {
                throw new Error('Download failed');
            }

            //blob is JS object for binary
            const blob = await response.blob();
            const link = document.createElement('a');

            // Creates URL for the file that was received as blob,
            link.href = URL.createObjectURL(blob);

            // sets download - attribute to the link,
            // which tells what name the downloaded file has when user presses download
            link.download = 'generated_sound.syx';

            link.click();
            setDownloadedSyx(false);

        } catch (error) {
            console.error('Download failed:', error);
            setDownloadedSyx(false);
        }
    };
}