import { useState, useCallback } from 'react';
import './Generator.css'
import ParameterForm from './assets/parameters'
import SyxUpload from './assets/syxUpload';

function SoundGenerator() {
  const [xmlBlob, setXmlBlob] = useState(null); // returned xml
  const [params, setParams] = useState(null);

  // parameter data from parameters.jsx
  const handleParamsChange = useCallback((data) => {
    setParams(data);
  }, []);

  //dx7 patch OBJECT
  const generatePatch = () => {
    if (!params) return alert("No parameters yet!");
// main parameters
    const patch = {
      name: params.name || 'NewPatch',
      algorithm: params.algorithm,
      feedback: 10,
      oscillator_sync: 10,
      lfo_speed: params.lfoSpeed,
      lfo_delay: 0,
      lfo_pm_depth: 0,
      lfo_am_depth: 0,
      pitch_mod_sensitivity: 0,
      lfo_waveform: params.lfoWaveform,
      lfo_sync: 0,
      transpose: 24,
      pitch_eg_rate1: 99,
      pitch_eg_rate2: 99,
      pitch_eg_rate3: 99,
      pitch_eg_rate4: 99,
      pitch_eg_level1: 99,
      pitch_eg_level2: 50,
      pitch_eg_level3: 50,
      pitch_eg_level4: 0,
    };
// operator parameters
    for (let i = 6; i >= 1; i--) {
      patch[`operator_${i}`] = {
        eg_rate1: 99,
        eg_rate2: 99,
        eg_rate3: 99,
        eg_rate4: 99,
        eg_level1: 99,
        eg_level2: 75,
        eg_level3: 50,
        eg_level4: 0,
        key_scaling_break: 60,
        key_scaling_left_depth: 0,
        key_scaling_right_depth: 0,
        key_scaling_left_curve: 0,
        key_scaling_right_curve: 0,
        oscillator_detune: 0,
        rate_scaling: 0,
        key_velocity_sensitivity: 0,
        amp_mod_sensitivity: 0,
        output_level: params.operatorParams.outputLvl,
        frequency_coarse: params.operatorParams.freqCoarse,
        oscillator_mode: params.operatorParams.oscillatorMode,
        frequency_fine: 0,
      };
    }
    console.log('Generated Patch:', patch);
    console.log(typeof (patch));
    // generating + buttonpress happens here:
    generateXML(patch);
  }

 // Object --> XML download
  const generateXML = (patch) => {
    // this needs to match generatePatch!
    const xmlContent = `
  <patch>
    <name>${patch.name}</name>
    <algorithm>${patch.algorithm}</algorithm>
    <feedback>${patch.feedback}</feedback>
    <oscillator_sync>${patch.oscillator_sync}</oscillator_sync>
    <lfo_speed>${patch.lfo_speed}</lfo_speed>
    <lfo_delay>${patch.lfo_delay}</lfo_delay>
    <lfo_am_depth>${patch.lfo_am_depth}<lfo_am_depth>
    <lfo_pm_depth>${patch.lfo_pm_depth}<lfo_pm_depth>
    <pitch_mod_sensitivity>${patch.pitch_mod_sensitivity}</pitch_mod_sensitivity>
    <lfo_waveform>${patch.lfo_waveform}</lfo_waveform>
    <lfo_sync>${patch.lfo_sync}</lfo_sync>
    <transpose>${patch.transpose}</transpose>
    <pitch_eg_rate1>${patch.pitch_eg_ratel}</pitch_eg_rate1>
    <pitch_eg_rate2>${patch.pitch_eg_rate2}</pitch_eg_rate2>
    <pitch_eg_rate3>${patch.pitch_eg_rate3}</pitch_eg_rate3>
    <pitch_eg_rate4>${patch.pitch_eg_rate4}</pitch_eg_rate4>
    <pitch_eg_level1>${patch.pitch_eg_level1}</pitch_eg_level1>
    <pitch_eg_level2>${patch.pitch_eg_level2}</pitch_eg_level2>
    <pitch_eg_level3>${patch.pitch_eg_level3}</pitch_eg_level3>
    <pitch_eg_level4>${patch.pitch_eg_level4}</pitch_eg_level4>
    ${[6,5,4,3,2,1].map(i => {
      const op = patch[`operator_${i}`]; 
      return `
      <operator id="${i}">
        <eg_rate1>${op?.eg_rate1 ?? 0}</eg_rate1>
        <eg_rate2>${op?.eg_rate2 ?? 0}</eg_rate2>
        <eg_rate3>${op?.eg_rate3 ?? 0}</eg_rate3>
        <eg_rate4>${op?.eg_rate4 ?? 0}</eg_rate4>
        <eg_level11>${op?.eg_level1 ?? 0}</eg_level11>
        <eg_level12>${op?.eg_level2 ?? 0}</eg_level12>
        <eg_level13>${op?.eg_level3 ?? 0}</eg_level13>
        <eg_level14>${op?.eg_level4 ?? 0}</eg_level14>
        <key_scaling_break>${op?.key_scaling_break ?? 0}</key_scaling_break>
        <key_scaling_left_depth>${op?.key_scaling_left_depth ?? 0}</key_scaling_left_depth>
        <key_scaling_right_depth>${op?.key_scaling_right_depth ?? 0}</key_scaling_right_depthk>
        <key_scaling_left_curve>${op?.key_scaling_left_curve ?? 0}</key_scaling_left_curve>
        <key_scaling_right_curve>${op?.key_scaling_right_curve ?? 0}</key_scaling_right_curve>
        <oscillator_detune>${op?.oscillator_detune ?? 0}</oscillator_detune>
        <rate_scaling>${op?.rate_scaling ?? 0}</rate_scaling>
        <key_velocity_sensitivity>${op?.key_velocity_sensitivity ?? 0}</key_velocity_sensitivity>
        <amp_mod_sensitivity>${op?.amp_mod_sensitivity ?? 0}</amp_mod_sensitivity>
        <output_level>${op?.output_level ?? 0}</output_level>
        <frequency_coarse>${op?.frequency_coarse ?? 0}</frequency_coarse>
        <oscillator_mode>${op?.oscillator_mode ?? 0}</oscillator_mode>
        <frequency_fine>${op?.frequency_fine ?? 0}</frequency_fine>
      </operator>
      `;
    }).join('')}
  </patch>
  `.trim();

    //Download file
    const blob = new Blob([xmlContent], { type: "application/xml" });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'patch.xml'; // File name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // take syx file from user, receive xml
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
