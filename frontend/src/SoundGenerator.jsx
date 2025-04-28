import { useState, useCallback } from "react";
import "./Generator.css";
import ParameterForm from "./assets/parameters";
import SyxUpload from "./assets/syxUpload";
import GenerateSyx from "./GenerateSyx1";

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
      name: params.name || "NewPatch",
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
      pitch_eg_rate1: 89,
      pitch_eg_rate2: 99,
      pitch_eg_rate3: 99,
      pitch_eg_rate4: 99,
      pitch_eg_level1: 99,
      pitch_eg_level2: 50,
      pitch_eg_level3: 50,
      pitch_eg_level4: 0,
    };
    // operator parameters
    const operatorParams = [];
    for (let i = 0; i < 6; i++) {
      const op = params.operatorParams[i];
      const operator = {
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
        output_level: op.outputLvl,
        frequency_coarse: op.freqCoarse,
        oscillator_mode: op.oscillatorMode,
        frequency_fine: 0,
      };
      operatorParams.push(operator);
      //debug:
      // console.log(op.freqCoarse);
      // console.log(op.outputLvl);
      // console.log(op.oscillatorMode);
    }
    console.log("Generated Patch:", patch);
    console.log(typeof patch);

    // Add operatorParams to the patch
    patch.operatorParams = operatorParams;

    // generating + buttonpress happens here:
    //generateXML(patch);

    // Example patch (Piano sound)
    const patch2 = {
      name: "Piano",
      algorithm: 1, // Algorithm 1 is commonly used for piano sounds
      feedback: 5, // Medium feedback for a clear sound
      oscillator_sync: 0, // No oscillator sync for a piano sound
      lfo_speed: 30, // Moderate LFO speed for subtle movement
      lfo_delay: 0, // No delay for LFO
      lfo_pm_depth: 0, // No pitch modulation depth for piano
      lfo_am_depth: 0, // No amplitude modulation depth
      pitch_mod_sensitivity: 0, // No pitch modulation
      lfo_waveform: 2, // Square wave LFO
      lfo_sync: 0, // No LFO sync
      transpose: 0, // No transpose for standard piano range
      pitch_eg_rate1: 50, // Standard attack rate for piano
      pitch_eg_rate2: 70, // Slightly faster decay
      pitch_eg_rate3: 85, // Sustain phase
      pitch_eg_rate4: 99, // Longer release phase
      pitch_eg_level1: 99, // Max pitch modulation depth at attack
      pitch_eg_level2: 80, // Lower sustain level for piano sound
      pitch_eg_level3: 60, // Sustain modulation to give more movement
      pitch_eg_level4: 0, // No pitch modulation at release phase
      operatorParams: Array.from({ length: 6 }, (_, i) => ({
        eg_rate1: 50, // Fast attack
        eg_rate2: 60, // Medium decay
        eg_rate3: 80, // Medium sustain
        eg_rate4: 99, // Long release
        eg_level1: 99, // Max level at attack
        eg_level2: 80, // Moderate sustain level
        eg_level3: 60, // Slight decrease in sustain
        eg_level4: 0, // No sound after release
        key_scaling_break: 60, // Break point for key scaling
        key_scaling_left_depth: 0, // No key scaling on the left
        key_scaling_right_depth: 0, // No key scaling on the right
        key_scaling_left_curve: 0, // No key scaling curve on the left
        key_scaling_right_curve: 0, // No key scaling curve on the right
        oscillator_detune: 0, // No detune for a clean piano sound
        rate_scaling: 0, // No rate scaling
        key_velocity_sensitivity: 0, // No velocity sensitivity
        amp_mod_sensitivity: 0, // No modulation sensitivity
        output_level: 100, // Max output level for a bright piano
        frequency_coarse: 20, // Standard coarse frequency for piano sounds
        oscillator_mode: 1, // Normal FM mode
        frequency_fine: 0, // No fine-tuning for this preset
      })),
    };

    generateSyx(patch2);
  };

  const generateSyx = (patch) => {
    const cartridge = new Uint8Array(32 * 155); // 32 patches, each 155 bytes long

    // Loop through all 32 patches
    for (let index = 0; index < 32; index++) {
      let currentPatch = patch;

      // If it's not the first patch, make it empty
      if (index !== 0) {
        currentPatch = {
          name: `Empty${index}`,
          algorithm: 0,
          feedback: 0,
          oscillator_sync: 0,
          lfo_speed: 0,
          lfo_delay: 0,
          lfo_pm_depth: 0,
          lfo_am_depth: 0,
          pitch_mod_sensitivity: 0,
          lfo_waveform: 0,
          lfo_sync: 0,
          transpose: 0,
          pitch_eg_rate1: 0,
          pitch_eg_rate2: 0,
          pitch_eg_rate3: 0,
          pitch_eg_rate4: 0,
          pitch_eg_level1: 0,
          pitch_eg_level2: 0,
          pitch_eg_level3: 0,
          pitch_eg_level4: 0,
          operatorParams: Array.from({ length: 6 }, () => ({
            eg_rate1: 0,
            eg_rate2: 0,
            eg_rate3: 0,
            eg_rate4: 0,
            eg_level1: 0,
            eg_level2: 0,
            eg_level3: 0,
            eg_level4: 0,
            key_scaling_break: 0,
            key_scaling_left_depth: 0,
            key_scaling_right_depth: 0,
            key_scaling_left_curve: 0,
            key_scaling_right_curve: 0,
            oscillator_detune: 0,
            rate_scaling: 0,
            key_velocity_sensitivity: 0,
            amp_mod_sensitivity: 0,
            output_level: 0,
            frequency_coarse: 0,
            oscillator_mode: 0,
            frequency_fine: 0,
          })),
        };
      }

      // Populate each operator's parameters for the patch
      for (let i = 0; i < 6; i++) {
        const op = currentPatch.operatorParams[i];
        const base = index * 155 + i * 21;

        // Set operator parameters
        cartridge[base + 0] = op.eg_rate1;
        cartridge[base + 1] = op.eg_rate2;
        cartridge[base + 2] = op.eg_rate3;
        cartridge[base + 3] = op.eg_rate4;

        cartridge[base + 4] = op.eg_level1;
        cartridge[base + 5] = op.eg_level2;
        cartridge[base + 6] = op.eg_level3;
        cartridge[base + 7] = op.eg_level4;

        cartridge[base + 8] = op.key_scaling_break;
        cartridge[base + 9] = op.key_scaling_left_depth;
        cartridge[base + 10] = op.key_scaling_right_depth;
        cartridge[base + 11] = op.key_scaling_left_curve;
        cartridge[base + 12] = op.key_scaling_right_curve;
        cartridge[base + 13] = op.rate_scaling;
        cartridge[base + 14] = op.amp_mod_sensitivity;
        cartridge[base + 15] = op.key_velocity_sensitivity;
        cartridge[base + 16] = op.output_level;

        const coarse = op.frequency_coarse & 0x1f;
        const mode = op.oscillator_mode & 0x01;
        cartridge[base + 17] = (mode << 6) | coarse;

        cartridge[base + 18] = op.frequency_fine;
        cartridge[base + 19] = op.oscillator_detune;
        cartridge[base + 20] = 0; // not used
      }

      // Set the algorithm and feedback for this patch
      cartridge[index * 155 + 134] = currentPatch.algorithm & 0x1f;
      cartridge[index * 155 + 135] =
        (currentPatch.feedback & 0x07) |
        ((currentPatch.oscillator_sync & 0x01) << 3);

      // Set the LFO parameters
      cartridge[index * 155 + 136] = currentPatch.lfo_speed;
      cartridge[index * 155 + 137] = currentPatch.lfo_delay;
      cartridge[index * 155 + 138] = currentPatch.lfo_pm_depth;
      cartridge[index * 155 + 139] = currentPatch.lfo_am_depth;
      cartridge[index * 155 + 140] = currentPatch.lfo_sync;
      cartridge[index * 155 + 141] = currentPatch.lfo_waveform;
      cartridge[index * 155 + 142] = currentPatch.pitch_mod_sensitivity;
      cartridge[index * 155 + 143] = currentPatch.transpose;

      // Set the pitch EG settings
      cartridge[index * 155 + 144] = currentPatch.pitch_eg_rate1;
      cartridge[index * 155 + 145] = currentPatch.pitch_eg_rate2;
      cartridge[index * 155 + 146] = currentPatch.pitch_eg_rate3;
      cartridge[index * 155 + 147] = currentPatch.pitch_eg_rate4;

      cartridge[index * 155 + 148] = currentPatch.pitch_eg_level1;
      cartridge[index * 155 + 149] = currentPatch.pitch_eg_level2;
      cartridge[index * 155 + 150] = currentPatch.pitch_eg_level3;
      cartridge[index * 155 + 151] = currentPatch.pitch_eg_level4;

      // Set the name for the patch (10 characters)
      const name = (currentPatch.name || "INIT VOICE")
        .padEnd(10, " ")
        .slice(0, 10)
        .toUpperCase();
      for (let i = 0; i < 10; i++) {
        cartridge[index * 155 + 152 + i] = name.charCodeAt(i);
      }
    }

    // Wrap the entire cartridge in a valid SysEx format
    function wrapInSysEx(cartridge) {
      const header = [0xf0, 0x43, 0x00, 0x09, 0x20]; // Yamaha bulk dump (32 patches)
      return Uint8Array.from([...header, ...cartridge, 0xf7]);
    }

    // Generate the SysEx data
    const syxData = wrapInSysEx(cartridge);

    // Create and trigger the file download
    const blob = new Blob([syxData], { type: "application/octet-stream" });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "dx7_cart.syx"; // Name of the SysEx file
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

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
    <lfo_am_depth>${patch.lfo_am_depth}</lfo_am_depth>
    <lfo_pm_depth>${patch.lfo_pm_depth}</lfo_pm_depth>
    <pitch_mod_sensitivity>${
      patch.pitch_mod_sensitivity
    }</pitch_mod_sensitivity>
    <lfo_waveform>${patch.lfo_waveform}</lfo_waveform>
    <lfo_sync>${patch.lfo_sync}</lfo_sync>
    <transpose>${patch.transpose}</transpose>
    <pitch_eg_rate1>${patch.pitch_eg_rate1}</pitch_eg_rate1>
    <pitch_eg_rate2>${patch.pitch_eg_rate2}</pitch_eg_rate2>
    <pitch_eg_rate3>${patch.pitch_eg_rate3}</pitch_eg_rate3>
    <pitch_eg_rate4>${patch.pitch_eg_rate4}</pitch_eg_rate4>
    <pitch_eg_level1>${patch.pitch_eg_level1}</pitch_eg_level1>
    <pitch_eg_level2>${patch.pitch_eg_level2}</pitch_eg_level2>
    <pitch_eg_level3>${patch.pitch_eg_level3}</pitch_eg_level3>
    <pitch_eg_level4>${patch.pitch_eg_level4}</pitch_eg_level4>
    ${[5, 4, 3, 2, 1, 0]
      .map((i) => {
        const op = patch.operatorParams[i];
        return `
      <operator id="${6 - i}">
        <eg_rate1>${op?.eg_rate1 ?? 0}</eg_rate1>
        <eg_rate2>${op?.eg_rate2 ?? 0}</eg_rate2>
        <eg_rate3>${op?.eg_rate3 ?? 0}</eg_rate3>
        <eg_rate4>${op?.eg_rate4 ?? 0}</eg_rate4>
        <eg_level11>${op?.eg_level1 ?? 0}</eg_level11>
        <eg_level12>${op?.eg_level2 ?? 0}</eg_level12>
        <eg_level13>${op?.eg_level3 ?? 0}</eg_level13>
        <eg_level14>${op?.eg_level4 ?? 0}</eg_level14>
        <key_scaling_break>${op?.key_scaling_break ?? 0}</key_scaling_break>
        <key_scaling_left_depth>${
          op?.key_scaling_left_depth ?? 0
        }</key_scaling_left_depth>
        <key_scaling_right_depth>${
          op?.key_scaling_right_depth ?? 0
        }</key_scaling_right_depth>
        <key_scaling_left_curve>${
          op?.key_scaling_left_curve ?? 0
        }</key_scaling_left_curve>
        <key_scaling_right_curve>${
          op?.key_scaling_right_curve ?? 0
        }</key_scaling_right_curve>
        <oscillator_detune>${op?.oscillator_detune ?? 0}</oscillator_detune>
        <rate_scaling>${op?.rate_scaling ?? 0}</rate_scaling>
        <key_velocity_sensitivity>${
          op?.key_velocity_sensitivity ?? 0
        }</key_velocity_sensitivity>
        <amp_mod_sensitivity>${
          op?.amp_mod_sensitivity ?? 0
        }</amp_mod_sensitivity>
        <output_level>${op?.output_level ?? 0}</output_level>
        <frequency_coarse>${op?.frequency_coarse ?? 0}</frequency_coarse>
        <oscillator_mode>${op?.oscillator_mode ?? 0}</oscillator_mode>
        <frequency_fine>${op?.frequency_fine ?? 0}</frequency_fine>
      </operator>
      `;
      })
      .join("")}
  </patch>
  `.trim();

    //Download file
    const blob = new Blob([xmlContent], { type: "application/xml" });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "patch.xml"; // File name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // take syx file from user, receive xml
  const Uploadfile = async (file) => {
    console.log("Upload button pressed");

    //send to backend
    const formData = new FormData();
    formData.append("syxFile", file);

    try {
      const response = await fetch(
        "http://localhost:8000/api/upload_syx_file",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      // receive xml from backend
      const xmlBlob = await response.blob();
      setXmlBlob(xmlBlob);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // download user's XML onClick
  const XmlDownload = () => {
    if (xmlBlob) {
      const url = URL.createObjectURL(xmlBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "converted.xml"; // customize the filename here
      link.click();
      URL.revokeObjectURL(url); // Clean up the object URL after download
    }
  };

  return (
    <>
      <div className="parameter_form">
        <ParameterForm onChange={handleParamsChange} />
      </div>
      <div className="upload_form">
        <SyxUpload onFileUpload={Uploadfile} />
      </div>
      <div className="buttons_container">
        {/* <button className='upload_btn'>Upload file</button> */}
        {/* Display download button only if XML is available */}
        {xmlBlob && (
          <button onClick={XmlDownload} className="download-button">
            Download XML
          </button>
        )}
        <button className="generate_btn" onClick={generatePatch}>
          Generate Sound
        </button>
      </div>
    </>
  );
}

export default SoundGenerator;
