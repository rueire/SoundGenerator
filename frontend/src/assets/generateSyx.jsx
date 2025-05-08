import { randomBetween } from "./parameters";

export default function generateSyx(patch) {
  const cartridge = new Uint8Array(32 * 128); // 32 patches, each 128 bytes long (Yamaha Dx7 bulk dump packet format, means voice patch is smaller than in single voice format)

  // Loop through all 32 patches
  for (let index = 0; index < 32; index++) {
    let currentPatch = patch;

    // If it's not the first patch, make it empty
    if (index !== 0) {
      currentPatch = {
        name: `Random${index}`,
        algorithm: randomBetween(1, 32),
        feedback: randomBetween(1, 4),
        oscillator_sync: 0,
        lfo_speed: 35,
        lfo_delay: 0,
        lfo_pm_depth: 0,
        lfo_am_depth: 0,
        pitch_mod_sensitivity: randomBetween(1, 7),
        lfo_waveform: randomBetween(1, 7),
        lfo_sync: 0,
        transpose: 24,
        pitch_eg_rate1: randomBetween(80, 95),
        pitch_eg_rate2: randomBetween(65, 99),
        pitch_eg_rate3: randomBetween(90, 90),
        pitch_eg_rate4: randomBetween(60, 99),
        pitch_eg_level1: 50,
        pitch_eg_level2: 50,
        pitch_eg_level3: 50,
        pitch_eg_level4: 50,
        operatorParams: Array.from({ length: 6 }, () => ({
          eg_rate1: randomBetween(45, 99),
          eg_rate2: randomBetween(0, 99),
          eg_rate3: randomBetween(0, 99),
          eg_rate4: randomBetween(70, 99),
          eg_level1: 99,
          eg_level2: randomBetween(75, 99),
          eg_level3: randomBetween(85, 99),
          eg_level4: 0,
          key_scaling_break: 0,
          key_scaling_left_depth: 0,
          key_scaling_right_depth: 0,
          key_scaling_left_curve: 3,
          key_scaling_right_curve: 2,
          oscillator_detune: 7,
          rate_scaling: randomBetween(0, 7),
          key_velocity_sensitivity: randomBetween(0, 7),
          amp_mod_sensitivity: 0,
          output_level: randomBetween(60, 99),
          frequency_coarse: randomBetween(0, 2),
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
}
