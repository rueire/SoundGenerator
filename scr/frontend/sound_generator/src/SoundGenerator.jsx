import './Generator.css'
import syxDownload from './assets/syxDownload'

function SoundGenerator() {

  const handleDownload = async() => {
    console.log("Button pressed")

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


  return (
    <>
      <div className='testbtn'>
        <button className='test_btn' onClick={handleDownload}>Test Button</button>
      </div>
    </>
  )
}

export default SoundGenerator
