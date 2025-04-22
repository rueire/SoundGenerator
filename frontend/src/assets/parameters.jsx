import { useState } from "react";

export default function ParameterForm(onSubmit) {

    //These params are taken from user
    const [params, setParams] = useState ({
        algorithm: 1, 
        lfoWaveform: 1,
        lfoSpeed: 10,
        operatorParams: {
            oscillatorMode: 1,
            outputLvl: 80,
            freqCoarse: 20,
        }
    });

    const [lfoWaveform, setLfoWaveform] = useState(0);

    const handleLfoChange = (e) => {
        setLfoWaveform(Number(e.target.value));
    }

    //Handle basic Parameters
    const handleInput = (e) => {
        const {name, value} = e.target;
        setParams((prev) => ({
            //name: Hakee kentän nimen, joka on määritetty name-attribuutilla (esim. name="algorithm")
            ...prev, [name] : Number(value),
        }));
    }

    //Handle Operator Parameters
    const handleOperatorInput = (e) => {
        const { name, value } = e.target;
        setParams((prev) => ({
            ...prev,
            operatorParams: {
                ...prev.operatorParams, [name]: Number(value),
            },
        }));
    };

    //Generate Sound Button press
    const handleGenerateSound = (e) => {
        e.preventDefault();
        onSubmit(params);
    };

    //For Loop for algorithm
    const algorithmOptions = [];
    for (let i = 1; i <= 32; i++) {
        algorithmOptions.push(
            <option key={i} value={i}>
                Algorithm {i}
            </option>
        );
    };

    return (
        <form onSubmit={handleGenerateSound} className="parameter-form">
            <div className="basic-parameters-container">
                <div className="algoritm-container">
                    <label htmlFor="algorithm">Algorithm:</label>
                    <select
                        name="algorithm"
                        value={params.algorithm}
                        onChange={handleInput}>
                        {algorithmOptions}
                    </select>
                </div>
                <div className="lfowave-container">
                    <label htmlFor="lfoWaveform">LFO Waveform:</label>
                    <input
                        type="range"
                        id="lfoWaveform"
                        name="lfoWaveform"
                        min="1"
                        max="5"
                        step="1"
                        value={lfoWaveform}
                        onChange={handleLfoChange}
                        className="lfo-slider"
                    />
                    <div className="slider-values">
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                        <span>4</span>
                        <span>5</span>
                    </div>
                </div>
                {/* LFO Speed Slider */}
                <div className="lfospeed-container">
                    <label htmlFor="lfoSpeed">LFO Speed:</label>
                    <input
                        type="range"
                        name="lfoSpeed"
                        min="0"
                        max="99"
                        value={params.lfoSpeed}
                        onChange={handleInput}
                    />
                    <span>{params.lfoSpeed}</span> {/* Display current value */}
                </div>
            </div>
            <div className="operator-parameters-container">
                <div className="osc-container">
                    <label htmlFor="oscillator">Oscillator:</label>
                    <select
                        name=""
                        value={params.oscillatorMode}
                        onChange={handleOperatorInput}>

                        <option value={0}>Ratio</option>
                        <option value={2}>Fixed</option>
                    </select>
                </div>
                <div className="output-container">
                    <label htmlFor="outputlvl">Output Level:</label>
                    <input
                        type="range"
                        name="outputLvl"
                        min="0"
                        max="99"
                        value={params.operatorParams.outputLvl}
                        onChange={handleOperatorInput}
                    />
                    <span>{params.operatorParams.outputLvl}</span> {/* Display current value */}
                </div>
                <div className="freqCoarse-container">
                    <label htmlFor="freqCoarse">Frequency Coarse:</label>
                    <input
                        type="range"
                        name="freqCoarse"
                        min="0"
                        max="31"
                        value={params.operatorParams.freqCoarse}
                        onChange={handleOperatorInput}
                    />
                    <span>{params.operatorParams.freqCoarse}</span> {/* Display current value */}
                </div>
            </div>
        </form>
    )
}