import { useState, useCallback } from "react";
import "./Generator.css";
import ParameterForm from "./assets/parameters";
import SyxUpload from "./assets/syxUpload";

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
    let brass_1_patch = {
      name: "BRASS   1",
      algorithm: 22,
      feedback: 7,
      oscillator_sync: 1,
      lfo_speed: 37,
      lfo_delay: 0,
      lfo_pm_depth: 5,
      lfo_am_depth: 0,
      pitch_mod_sensitivity: 3,
      lfo_waveform: 4,
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
          eg_rate1: 49,
          eg_rate2: 99,
          eg_rate3: 28,
          eg_rate4: 68,
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
          rate_scaling: 4,
          key_velocity_sensitivity: 2,
          amp_mod_sensitivity: 0,
          output_level: 82,
          frequency_coarse: 1,
          oscillator_mode: 0,
          frequency_fine: 0,
        },

        {
          eg_rate1: 77,
          eg_rate2: 36,
          eg_rate3: 41,
          eg_rate4: 71,
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
          rate_scaling: 0,
          key_velocity_sensitivity: 2,
          amp_mod_sensitivity: 0,
          output_level: 98,
          frequency_coarse: 1,
          oscillator_mode: 0,
          frequency_fine: 0,
        },

        {
          eg_rate1: 77,
          eg_rate2: 36,
          eg_rate3: 41,
          eg_rate4: 71,
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
          rate_scaling: 0,
          key_velocity_sensitivity: 2,
          amp_mod_sensitivity: 0,
          output_level: 99,
          frequency_coarse: 1,
          oscillator_mode: 0,
          frequency_fine: 0,
        },

        {
          eg_rate1: 77,
          eg_rate2: 76,
          eg_rate3: 82,
          eg_rate4: 71,
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
          rate_scaling: 0,
          key_velocity_sensitivity: 2,
          amp_mod_sensitivity: 0,
          output_level: 99,
          frequency_coarse: 1,
          oscillator_mode: 0,
          frequency_fine: 0,
        },

        {
          eg_rate1: 62,
          eg_rate2: 51,
          eg_rate3: 29,
          eg_rate4: 71,
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
          rate_scaling: 0,
          key_velocity_sensitivity: 0,
          amp_mod_sensitivity: 0,
          output_level: 86,
          frequency_coarse: 0,
          oscillator_mode: 0,
          frequency_fine: 0,
        },
        {
          eg_rate1: 72,
          eg_rate2: 76,
          eg_rate3: 99,
          eg_rate4: 71,
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
          rate_scaling: 0,
          key_velocity_sensitivity: 0,
          amp_mod_sensitivity: 0,
          output_level: 98,
          frequency_coarse: 0,
          oscillator_mode: 0,
          frequency_fine: 0,
        },
      ],
    };
    generateSyx(brass_1_patch);
  };

  const generateSyx = (patch) => {
    const cartridge = new Uint8Array(32 * 128); // 32 patches, each 128 bytes long (Yamaha Dx7 bulk dump packet format, means voice patch is smaller than in single voice format)

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

      // Operator data
      for (let i = 0; i < 6; i++) {
        const op = currentPatch.operatorParams[5 - i];
        const base = index * 128 + (5 - i) * 17; // Begins writing from operator 6-> op1.

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
        cartridge[base + 11] =
          (op.key_scaling_left_curve & 0x03) |
          ((op.key_scaling_right_curve & 0x03) << 2);
        cartridge[base + 12] =
          ((op.oscillator_detune & 0x1f) << 3) | (op.rate_scaling & 0x07);
        cartridge[base + 13] =
          ((op.key_velocity_sensitivity & 0x07) << 2) |
          (op.amp_mod_sensitivity & 0x03);
        cartridge[base + 14] = op.output_level;
        cartridge[base + 15] =
          ((op.frequency_coarse & 0x1f) << 1) | (op.oscillator_mode & 0x01);
        cartridge[base + 16] = op.frequency_fine;
      }

      // Sets common parameters
      const base = index * 128;

      cartridge[base + 102] = currentPatch.pitch_eg_rate1;
      cartridge[base + 103] = currentPatch.pitch_eg_rate2;
      cartridge[base + 104] = currentPatch.pitch_eg_rate3;
      cartridge[base + 105] = currentPatch.pitch_eg_rate4;

      cartridge[base + 106] = currentPatch.pitch_eg_level1;
      cartridge[base + 107] = currentPatch.pitch_eg_level2;
      cartridge[base + 108] = currentPatch.pitch_eg_level3;
      cartridge[base + 109] = currentPatch.pitch_eg_level4;

      cartridge[base + 110] = (currentPatch.algorithm - 1) & 0x1f;
      // Feedback is in bits 0–2, oscillator key sync is bit 3 of byte 111.
      cartridge[base + 111] =
        (currentPatch.feedback & 0x07) |
        ((currentPatch.oscillator_sync & 0x01) << 3);

      cartridge[base + 112] = currentPatch.lfo_speed;
      cartridge[base + 113] = currentPatch.lfo_delay;
      cartridge[base + 114] = currentPatch.lfo_pm_depth;
      cartridge[base + 115] = currentPatch.lfo_am_depth;
      // Byte 116: is in order 76543210. Pitch mod sensitivity (bits 6-4), lfo waveform (bits 3-1), lfo sync (bit 0).
      cartridge[base + 116] =
        ((currentPatch.pitch_mod_sensitivity & 0x07) << 4) |
        ((currentPatch.lfo_waveform & 0x07) << 1) |
        (currentPatch.lfo_sync & 0x01);

      cartridge[base + 117] = currentPatch.transpose;

      // Set the name for the patch (10 characters)
      const name = (currentPatch.name || "INIT VOICE")
        .padEnd(10, " ")
        .slice(0, 10)
        .toUpperCase();
      for (let j = 0; j < 10; j++) {
        cartridge[base + 118 + j] = name.charCodeAt(j);
      }
    }

    const sum = cartridge.reduce((acc, byte) => acc + (byte & 0x7f), 0);
    const checksum = (128 - (sum % 128)) % 128;

    // Wrap the entire cartridge in a valid SysEx format
    function wrapInSysEx(cartridge) {
      const header = [0xf0, 0x43, 0x00, 0x09, 0x20, 0x00]; // Yamaha bulk dump (32 patches)
      return Uint8Array.from([...header, ...cartridge, checksum, 0xf7]);
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
