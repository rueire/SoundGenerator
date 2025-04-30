import { useState, useCallback } from 'react';
import './Generator.css'
import ParameterForm from './assets/parameters'
import SyxUpload from './assets/syxUpload';
import generateSyx from './assets/generateSyx';

function SoundGenerator() {
  const [xmlBlob, setXmlBlob] = useState(null); // returned xml
  const [params, setParams] = useState(null);

  // parameter data from parameters.jsx
  const handleParamsChange = useCallback((data) => {
    setParams(data);
  }, []);

  //dx7 patch OBJECT
  const generatePatch = () => {
    
    let brass_1_patch = {
      name: "BRASS   1",
      algorithm: params.algorithm,
      feedback: params.feedback,
      oscillator_sync: 1,
      lfo_speed: 0,
      lfo_delay: 0,
      lfo_pm_depth: 5,
      lfo_am_depth: 0,
      pitch_mod_sensitivity: params.pitchSensitivity,
      lfo_waveform: 5,
      lfo_sync: 0,
      transpose: 24,
      pitch_eg_rate1: 84,
      pitch_eg_rate2: 95,
      pitch_eg_rate3: 95,
      pitch_eg_rate4: 60,
      pitch_eg_level1: 50,
      pitch_eg_level2: 50,
      pitch_eg_level3: 50,
      pitch_eg_level4: 50,
      operatorParams: [
        {
          eg_rate1: params.operatorParams[5]?.eg_rate1 ?? 49,
          eg_rate2: 99,
          eg_rate3: 28,
          eg_rate4: params.operatorParams[5]?.eg_rate4 ?? 68,
          eg_level1: 98,
          eg_level2: 98,
          eg_level3: 91,
          eg_level4: 0,
          key_scaling_break: 39,
          key_scaling_left_depth: 54,
          key_scaling_right_depth: 50,
          key_scaling_left_curve: 1,
          key_scaling_right_curve: 1,
          oscillator_detune: 7,
          rate_scaling: params.operatorParams[5]?.rateScaling ?? 4,
          key_velocity_sensitivity: 2,
          amp_mod_sensitivity: 0,
          output_level: params.operatorParams[5]?.output_level ?? 80,
          frequency_coarse: 1,
          oscillator_mode: params.operatorParams[5]?.oscillatorMode ?? 0,
          frequency_fine: 0,
        },

        {
          eg_rate1: params.operatorParams[4]?.eg_rate1 ?? 77,
          eg_rate2: 36,
          eg_rate3: 41,
          eg_rate4: params.operatorParams[4]?.eg_rate4 ?? 71,
          eg_level1: 99,
          eg_level2: 98,
          eg_level3: 98,
          eg_level4: 0,
          key_scaling_break: 39,
          key_scaling_left_depth: 0,
          key_scaling_right_depth: 0,
          key_scaling_left_curve: 3,
          key_scaling_right_curve: 3,
          oscillator_detune: 8,
          rate_scaling: params.operatorParams[4]?.rateScaling ?? 0,
          key_velocity_sensitivity: 2,
          amp_mod_sensitivity: 0,
          output_level: params.operatorParams[4]?.output_level ?? 98,
          frequency_coarse: 1,
          oscillator_mode: params.operatorParams[4]?.oscillatorMode ?? 0,
          frequency_fine: 0,
        },

        {
          eg_rate1: params.operatorParams[3]?.eg_rate1 ?? 77,
          eg_rate2: 36,
          eg_rate3: 41,
          eg_rate4: params.operatorParams[3]?.eg_rate4 ?? 71,
          eg_level1: 99,
          eg_level2: 98,
          eg_level3: 98,
          eg_level4: 0,
          key_scaling_break: 39,
          key_scaling_left_depth: 0,
          key_scaling_right_depth: 0,
          key_scaling_left_curve: 3,
          key_scaling_right_curve: 3,
          oscillator_detune: 7,
          rate_scaling: params.operatorParams[3]?.rateScaling ?? 0,
          key_velocity_sensitivity: 2,
          amp_mod_sensitivity: 0,
          output_level: params.operatorParams[3]?.output_level ?? 99,
          frequency_coarse: 1,
          oscillator_mode: params.operatorParams[3]?.oscillatorMode ?? 0,
          frequency_fine: 0,
        },

        {
          eg_rate1: params.operatorParams[2]?.eg_rate1 ?? 77,
          eg_rate2: 76,
          eg_rate3: 82,
          eg_rate4: params.operatorParams[2]?.eg_rate4 ?? 71,
          eg_level1: 99,
          eg_level2: 98,
          eg_level3: 98,
          eg_level4: 0,
          key_scaling_break: 39,
          key_scaling_left_depth: 0,
          key_scaling_right_depth: 0,
          key_scaling_left_curve: 3,
          key_scaling_right_curve: 3,
          oscillator_detune: 5,
          rate_scaling: params.operatorParams[2]?.rateScaling ?? 0,
          key_velocity_sensitivity: 2,
          amp_mod_sensitivity: 0,
          output_level: params.operatorParams[2]?.output_level ?? 99,
          frequency_coarse: 1,
          oscillator_mode: params.operatorParams[2]?.oscillatorMode ?? 0,
          frequency_fine: 0,
        },

        {
          eg_rate1: params.operatorParams[1]?.eg_rate1 ?? 62,
          eg_rate2: 51,
          eg_rate3: 29,
          eg_rate4: params.operatorParams[1]?.eg_rate4 ?? 71,
          eg_level1: 82,
          eg_level2: 95,
          eg_level3: 96,
          eg_level4: 0,
          key_scaling_break: 27,
          key_scaling_left_depth: 0,
          key_scaling_right_depth: 7,
          key_scaling_left_curve: 3,
          key_scaling_right_curve: 1,
          oscillator_detune: 14,
          rate_scaling: params.operatorParams[1]?.rateScaling ?? 0,
          key_velocity_sensitivity: 0,
          amp_mod_sensitivity: 0,
          output_level: params.operatorParams[1]?.output_level ?? 86,
          frequency_coarse: 0,
          oscillator_mode: params.operatorParams[1]?.oscillatorMode ?? 0,
          frequency_fine: 0,
        },
        {
          eg_rate1: params.operatorParams[0]?.eg_rate1 ?? 72,
          eg_rate2: 76,
          eg_rate3: 99,
          eg_rate4: params.operatorParams[0]?.eg_rate4 ?? 71,
          eg_level1: 99,
          eg_level2: 88,
          eg_level3: 96,
          eg_level4: 0,
          key_scaling_break: 39,
          key_scaling_left_depth: 0,
          key_scaling_right_depth: 14,
          key_scaling_left_curve: 3,
          key_scaling_right_curve: 3,
          oscillator_detune: 14,
          rate_scaling: params.operatorParams[0]?.rateScaling ?? 0,
          key_velocity_sensitivity: 0,
          amp_mod_sensitivity: 0,
          output_level: params.operatorParams[0]?.output_level ?? 98,
          frequency_coarse: 0,
          oscillator_mode: params.operatorParams[0]?.oscillatorMode ?? 0,
          frequency_fine: 0,
        },
      ],
    };
    generateSyx(brass_1_patch);
  }

  const Uploadfile = async (file) => {
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
  // download user's XML onClick
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
        <ParameterForm onChange={handleParamsChange} />
      </div>
      <div className='upload_form'>
        <SyxUpload onFileUpload={Uploadfile} />
      </div>
      <div className='buttons_container'>
        {/* <button className='upload_btn'>Upload file</button> */}
        {/* Display download button only if XML is available */}
        {xmlBlob && (
          <button onClick={XmlDownload} className="download-button">
            Download XML
          </button>
        )}
        <button className='generate_btn' onClick={generatePatch}>Generate Sound</button>
      </div>
    </>
  )
}

export default SoundGenerator
