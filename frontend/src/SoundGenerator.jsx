import { useState } from 'react';
import './Generator.css'
import syxDownload from './assets/syxDownload'
import ParameterForm from './assets/parameters'
import SyxUpload from './assets/syxUpload';

function SoundGenerator() {

  const [isGenerating, setIsGenerating] = useState(false); // Track the generation state
  // const [generatedFile, setGeneratedFile] = useState(null); // Uploaded .syx file
  const [generatedFile, setGeneratedFile] = useState(null); // Store the generated .syx file
  const [xmlBlob, setXmlBlob] = useState(null); // returned xml

  // generated_file downlod handling
  // should be put to GenerateSound?
  //doesnt rly work yet since nothing is generated
  const handleDownload = async() => {
    console.log("Button2 pressed")

    const blob = await syxDownload(); // get blob from backend
    if (!blob) {
      console.log('No connection to backend yet!')
      return; // handle error
    }
    const link = document.createElement('a');
    
    // Creates URL for the file that was received as blob,
    //Will download a file no matter what 
    link.href = URL.createObjectURL(blob);

    // sets download - attribute to the link,
    // which tells what name the downloaded file has when user presses download
    link.download = 'generated_sound.syx';
    link.click();
  }

  // Generate Sound button
  const GenerateSound = async (params) => {
      //tämän pitäisi olla nappi, joka lähettää tiedot backendille
      // jossa luodaan xml, ja muunnetaan .syx tirdostoksi
      console.log('button1 pressed')
          try {
              const response = await fetch('info tähän', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(params),
              });

              if (!response.ok) {
                  throw new Error('Failed to generate')
              }
              const blob = await response.blob();
            setGeneratedFile(blob); // Save the generated file to the state
            setIsGenerating(false); // File generation is complete
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'generated_patch.syx';
              a.click();
          } catch (error) {
              console.error('Error:', error);
            setIsGenerating(false);
          }
      }
  
  // take file from user
  const Uploadfile = async(file) => {
    console.log("Upload button pressed")
    
    //send to backend
    const formData = new FormData();
    formData.append("syxFile", file);

     try {
       const response = await fetch("http://localhost:8000/api/upload_syx_file", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("File upload failed");
      }

      // receive xml from backend
      const xmlBlob = await response.blob();
      setXmlBlob(xmlBlob);

    } catch (error) {
      console.error("Error:", error);
    }
  }
  // XML button onClick
  const XmlDownload = () => {
    if (xmlBlob) {
      const url = URL.createObjectURL(xmlBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'converted.xml'; // customize the filename here
      link.click();
      URL.revokeObjectURL(url); // Clean up the object URL after download
    }
  }


  return (
    <>
    <div className='parameter_form'>
      <ParameterForm onSubmit={ParameterForm} />
      </div>
      <div className='upload_form'>
        <SyxUpload onFileUpload={Uploadfile} />
        {/* Display download button only if XML is available */}
        {xmlBlob && (
          <button onClick={XmlDownload} className="download-button">
            Download XML
          </button>
        )}
      </div>
      <div className='buttons_container'>
        {/* <button className='upload_btn'>Upload file</button> */}
        <button className='generate_btn' onClick={GenerateSound}>Generate Sound</button>
        {generatedFile && (<button onClick={handleDownload} disabled={isGenerating}>
          Download File
        </button>)}
      </div>
    </>
  )
}

export default SoundGenerator
