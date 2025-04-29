# Generates a syx file, based on the preset values.
# First voice patch is BRASS 1, that works in Dexed. Rest are EMPTY with mostly 0 values.

# run with:
# python generate_syx.py

def generate_dx7_bulk(patch):
    cartridge = bytearray(32 * 128)  # 32 patches, 128 bytes each

    for index in range(32):
        current_patch = patch.copy() if index == 0 else {
            'name': f'EMPTY{index:02}',
            'algorithm': 1,
            'feedback': 0,
            'oscillator_sync': 0,
            'lfo_speed': 0,
            'lfo_delay': 0,
            'lfo_pm_depth': 0,
            'lfo_am_depth': 0,
            'pitch_mod_sensitivity': 0,
            'lfo_waveform': 0,
            'lfo_sync': 0,
            'transpose': 24,
            'pitch_eg_rate1': 0,
            'pitch_eg_rate2': 0,
            'pitch_eg_rate3': 0,
            'pitch_eg_rate4': 0,
            'pitch_eg_level1': 0,
            'pitch_eg_level2': 0,
            'pitch_eg_level3': 0,
            'pitch_eg_level4': 0,
            'operatorParams': [
                {
                    'eg_rate1': 0,
                    'eg_rate2': 0,
                    'eg_rate3': 0,
                    'eg_rate4': 0,
                    'eg_level1': 0,
                    'eg_level2': 0,
                    'eg_level3': 0,
                    'eg_level4': 0,
                    'key_scaling_break': 0,
                    'key_scaling_left_depth': 0,
                    'key_scaling_right_depth': 0,
                    'key_scaling_left_curve': 0,
                    'key_scaling_right_curve': 0,
                    'oscillator_detune': 0,
                    'rate_scaling': 0,
                    'key_velocity_sensitivity': 0,
                    'amp_mod_sensitivity': 0,
                    'output_level': 0,
                    'frequency_coarse': 0,
                    'oscillator_mode': 0,
                    'frequency_fine': 0
                } for _ in range(6)
            ]
        }

        # Writes operator data (op6 -> op1).
        for op_index in range(6):
            op = current_patch['operatorParams'][5 - op_index] # Op6 first
            base = index * 128 + (5 - op_index) * 17

            cartridge[base + 0] = op['eg_rate1']
            cartridge[base + 1] = op['eg_rate2']
            cartridge[base + 2] = op['eg_rate3']
            cartridge[base + 3] = op['eg_rate4']
            cartridge[base + 4] = op['eg_level1']
            cartridge[base + 5] = op['eg_level2']
            cartridge[base + 6] = op['eg_level3']
            cartridge[base + 7] = op['eg_level4']
            cartridge[base + 8] = op['key_scaling_break']
            cartridge[base + 9] = op['key_scaling_left_depth']
            cartridge[base + 10] = op['key_scaling_right_depth']
            cartridge[base + 11] = (op['key_scaling_left_curve'] & 0x03) | ((op['key_scaling_right_curve'] & 0x03) << 2)
            cartridge[base + 12] = ((op['oscillator_detune'] & 0x1f) << 3) | (op['rate_scaling'] & 0x07)
            cartridge[base + 13] = ((op['key_velocity_sensitivity'] & 0x07) << 2) | (op['amp_mod_sensitivity'] & 0x03)
            cartridge[base + 14] = op['output_level']
            cartridge[base + 15] = ((op['frequency_coarse'] & 0x1f) << 1) | (op['oscillator_mode'] & 0x01)
            cartridge[base + 16] = op['frequency_fine']

        # Writes common parameters.
        common_base = index * 128

        cartridge[common_base + 102] = current_patch['pitch_eg_rate1']
        cartridge[common_base + 103] = current_patch['pitch_eg_rate2']
        cartridge[common_base + 104] = current_patch['pitch_eg_rate3']
        cartridge[common_base + 105] = current_patch['pitch_eg_rate4']
        cartridge[common_base + 106] = current_patch['pitch_eg_level1']
        cartridge[common_base + 107] = current_patch['pitch_eg_level2']
        cartridge[common_base + 108] = current_patch['pitch_eg_level3']
        cartridge[common_base + 109] = current_patch['pitch_eg_level4']
        cartridge[common_base + 110] = (current_patch['algorithm'] - 1) & 0x1f
        cartridge[common_base + 111] = (current_patch['feedback'] & 0x07) | ((current_patch['oscillator_sync'] & 0x01) << 3)
        cartridge[common_base + 112] = current_patch['lfo_speed']
        cartridge[common_base + 113] = current_patch['lfo_delay']
        cartridge[common_base + 114] = current_patch['lfo_pm_depth']
        cartridge[common_base + 115] = current_patch['lfo_am_depth']
        cartridge[common_base + 116] = ((current_patch['pitch_mod_sensitivity'] & 0x07) << 4) | ((current_patch['lfo_waveform'] & 0x07) << 1) | (current_patch['lfo_sync'] & 0x01)
        cartridge[common_base + 117] = current_patch['transpose']

        # Writes patch name.
        name = (current_patch['name'] or "INIT VOICE").ljust(10)[:10].upper()
        #print("Writing patch name for index", index, ":", repr(current_patch['name']))
        #print("Final padded name:", repr(name))
        for i, c in enumerate(name):
            cartridge[common_base + 118 + i] = ord(c)

    # Checks cartridge size
    #print("Cartridge size:", len(cartridge))  # Should print 4096

    # Extra check for debugging
    #patch_name_bytes = cartridge[118:128]
    #print("Patch name raw bytes:", patch_name_bytes)
    #print("Patch name:", patch_name_bytes.decode("ascii", errors="replace"))

    # Wraps in SysEx format.
    header = bytes([0xF0, 0x43, 0x00, 0x09, 0x20, 0x00])
    # Calculates checksum: it's sum of all 4096 cartridge bytes, modulo 128, subtract from 128.
    checksum = (128 - (sum(cartridge) % 128)) % 128
    checksum_byte = bytes([checksum])
    footer = bytes([0xF7])

    #print("Header:", header)
    #print("First few voice bytes:", cartridge[:16])
    #print("Checksum:", checksum_byte)
    #print("Footer:", footer)
    #print("Total length:", len(header + cartridge + checksum_byte + footer))  # Should be 4104

    sysex_data = header + cartridge + checksum_byte + footer

    with open("dx7_cart.syx", "wb") as f:
        f.write(sysex_data)

    #print("Total sysex size:", len(sysex_data))  # Should print 4104
    print("Created sysex file 'dx7_cart.syx'!")


#  Test patch, BRASS 1 from Yamaha DX7 Rom1a.syx.
brass_1_patch = {
    'name': "BRASS   1",
    'algorithm': 22,
    'feedback': 7,
    'oscillator_sync': 1,
    'lfo_speed': 37,
    'lfo_delay': 0,
    'lfo_pm_depth': 5,
    'lfo_am_depth': 0,
    'pitch_mod_sensitivity': 3,
    'lfo_waveform': 4,
    'lfo_sync': 0,
    'transpose': 24,
    'pitch_eg_rate1': 84,
    'pitch_eg_rate2': 95,
    'pitch_eg_rate3': 95,
    'pitch_eg_rate4': 60,
    'pitch_eg_level1': 50,
    'pitch_eg_level2': 50,
    'pitch_eg_level3': 50,
    'pitch_eg_level4': 50,
    'operatorParams': [
        # Operator 6
        {
            "eg_rate1": 49, "eg_rate2": 99, "eg_rate3": 28, "eg_rate4": 68,
            "eg_level1": 98, "eg_level2": 98, "eg_level3": 91, "eg_level4": 0,
            "key_scaling_break": 39,
            "key_scaling_left_depth": 54,
            "key_scaling_right_depth": 50,
            "key_scaling_left_curve": 1,
            "key_scaling_right_curve": 1,
            "oscillator_detune": 7,
            "rate_scaling": 4,
            "key_velocity_sensitivity": 2,
            "amp_mod_sensitivity": 0,
            "output_level": 82,
            "frequency_coarse": 1,
            "oscillator_mode": 0,
            "frequency_fine": 0
        },
        # Operator 5
        {
            "eg_rate1": 77, "eg_rate2": 36, "eg_rate3": 41, "eg_rate4": 71,
            "eg_level1": 99, "eg_level2": 98, "eg_level3": 98, "eg_level4": 0,
            "key_scaling_break": 39,
            "key_scaling_left_depth": 0,
            "key_scaling_right_depth": 0,
            "key_scaling_left_curve": 3,
            "key_scaling_right_curve": 3,
            "oscillator_detune": 8,
            "rate_scaling": 0,
            "key_velocity_sensitivity": 2,
            "amp_mod_sensitivity": 0,
            "output_level": 98,
            "frequency_coarse": 1,
            "oscillator_mode": 0,
            "frequency_fine": 0
        },
        # Operator 4
        {
            "eg_rate1": 77, "eg_rate2": 36, "eg_rate3": 41, "eg_rate4": 71,
            "eg_level1": 99, "eg_level2": 98, "eg_level3": 98, "eg_level4": 0,
            "key_scaling_break": 39,
            "key_scaling_left_depth": 0,
            "key_scaling_right_depth": 0,
            "key_scaling_left_curve": 3,
            "key_scaling_right_curve": 3,
            "oscillator_detune": 7,
            "rate_scaling": 0,
            "key_velocity_sensitivity": 2,
            "amp_mod_sensitivity": 0,
            "output_level": 99,
            "frequency_coarse": 1,
            "oscillator_mode": 0,
            "frequency_fine": 0
        },
        # Operator 3
        {
            "eg_rate1": 77, "eg_rate2": 76, "eg_rate3": 82, "eg_rate4": 71,
            "eg_level1": 99, "eg_level2": 98, "eg_level3": 98, "eg_level4": 0,
            "key_scaling_break": 39,
            "key_scaling_left_depth": 0,
            "key_scaling_right_depth": 0,
            "key_scaling_left_curve": 3,
            "key_scaling_right_curve": 3,
            "oscillator_detune": 5,
            "rate_scaling": 0,
            "key_velocity_sensitivity": 2,
            "amp_mod_sensitivity": 0,
            "output_level": 99,
            "frequency_coarse": 1,
            "oscillator_mode": 0,
            "frequency_fine": 0
        },
        # Operator 2
        {
            "eg_rate1": 62, "eg_rate2": 51, "eg_rate3": 29, "eg_rate4": 71,
            "eg_level1": 82, "eg_level2": 95, "eg_level3": 96, "eg_level4": 0,
            "key_scaling_break": 27,
            "key_scaling_left_depth": 0,
            "key_scaling_right_depth": 7,
            "key_scaling_left_curve": 3,
            "key_scaling_right_curve": 1,
            "oscillator_detune": 14,
            "rate_scaling": 0,
            "key_velocity_sensitivity": 0,
            "amp_mod_sensitivity": 0,
            "output_level": 86,
            "frequency_coarse": 0,
            "oscillator_mode": 0,
            "frequency_fine": 0
        },
        # Operator 1
        {
            "eg_rate1": 72, "eg_rate2": 76, "eg_rate3": 99, "eg_rate4": 71,
            "eg_level1": 99, "eg_level2": 88, "eg_level3": 96, "eg_level4": 0,
            "key_scaling_break": 39,
            "key_scaling_left_depth": 0,
            "key_scaling_right_depth": 14,
            "key_scaling_left_curve": 3,
            "key_scaling_right_curve": 3,
            "oscillator_detune": 14,
            "rate_scaling": 0,
            "key_velocity_sensitivity": 0,
            "amp_mod_sensitivity": 0,
            "output_level": 98,
            "frequency_coarse": 0,
            "oscillator_mode": 0,
            "frequency_fine": 0
        },
    ]
}

generate_dx7_bulk(brass_1_patch)