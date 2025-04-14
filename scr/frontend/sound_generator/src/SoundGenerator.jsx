import { useState } from 'react';
import './Generator.css'
import syxDownload from './assets/syxDownload'
import ParameterForm from './assets/parameters'

function SoundGenerator() {

  const [isGenerating, setIsGenerating] = useState(false); // Track the generation state
  const [generatedFile, setGeneratedFile] = useState(null); // Store the generated .syx file

  //download button handling
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
  

  return (
    <>
    <div className='parameter_form'>
      <ParameterForm onSubmit={ParameterForm} />
        <div className='buttons_container'>
          <button className='generate_btn' onClick={GenerateSound}>Generate Sound</button>
          {generatedFile && (<button onClick={handleDownload} disabled={isGenerating}>
            Download File
          </button>)}
        </div>
    </div>
    </>
  )
}

export default SoundGenerator
