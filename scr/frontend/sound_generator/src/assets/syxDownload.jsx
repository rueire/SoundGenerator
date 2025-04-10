

export default async function syxDownload() {


    // requestDownload requests backend
    try {
        const response = await fetch('esimerkkinä: /api/generate_syx');
        if (!response.ok) {
            throw new Error('Download failed');
        }

        //blob is JS object for binary
        const blob = await response.blob();
        return blob;

    } catch (error) {
        console.error('Download failed:', error);
    }
}