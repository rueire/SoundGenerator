import { useState, useEffect } from "react";

export default function ParameterForm({ onChange }) {
    // const [lfoWaveform, setLfoWaveform] = useState(0);
    // const [xmlBlob, setXmlBlob] = useState(null); // xml to send

    //These params are taken from user
    const [params, setParams] = useState({
        algorithm: 1,
        lfoWaveform: 1,
        lfoSpeed: 10,
        operatorParams: Array(6).fill().map(() => ({
            oscillatorMode: 1,
            outputLvl: 80,
            freqCoarse: 20
        }))
    });

    //Handle basic Parameters
    const handleInput = (e) => {
        const { name, value } = e.target;
        setParams((prev) => ({
            //name: Hakee kentän nimen, joka on määritetty name-attribuutilla (esim. name="algorithm")
            ...prev, [name]: Number(value),
        }));
    }

    //Handle Operator Parameters
    const handleOperatorInput = (index, e) => {

        setParams((prev) => {
            console.log(params.operatorParams[index]); // debug
            const updatedOperators = [...prev.operatorParams];
            updatedOperators[index][e.target.name] = parseInt(e.target.value, 10);

            return {
                ...prev,
                operatorParams: updatedOperators,
            };
        });
    };

    // keep up w/parameter changes
    useEffect(() => {
        onChange(params);
    }, [params, onChange]);

    //For Loop for algorithm options
    const algorithmOptions = [];
    for (let i = 1; i <= 32; i++) {
        algorithmOptions.push(
            <option key={i} value={i}>
                Algorithm {i}
            </option>
        );
    };

    // 3 basic params
    // 3 operator params *3
    return (
        <form className="parameter-form">
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
                        min="0"
                        max="5"
                        step="1"
                        value={params.lfoWaveform}
                        onChange={handleInput}
                        className="lfo-slider"
                    />
                    <div className="slider-values">
                        <span>0</span>
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
            {/* map through op.params*/}
            {params.operatorParams.map((op, index) => (
                <div key={index}>
                    <div className="operator-parameters-container">
                        <div className="output-container">
                            <label htmlFor="6"> {index + 1} </label>
                            <div className="osc-container" id='osc_param6'>
                                <label htmlFor="oscillator">Oscillator:</label>
                                <select
                                    name="oscillatorMode"
                                    value={op.oscillatorMode}
                                    onChange={(e) => handleOperatorInput(index, e)}
                                >
                                    <option value={0}>Ratio</option>
                                    <option value={1}>Fixed</option>
                                </select>
                            </div>
                        </div>
                        <div className="output-container">
                            <label htmlFor="outputlvl">Output Level:</label>
                            <input
                                type="range"
                                name="outputLvl"
                                min="0"
                                max="99"
                                value={op.outputLvl}
                                onChange={(e) => handleOperatorInput(index, e)}
                            />
                            <span>{op.outputLvl}</span> {/* Display current value */}
                        </div>
                        <div className="freqCoarse-container">
                            <label htmlFor="freqCoarse">Frequency Coarse:</label>
                            <input
                                type="range"
                                name="freqCoarse"
                                min="0"
                                max="31"
                                value={params.operatorParams.freqCoarse}
                                onChange={(e) => handleOperatorInput(index, e)}
                            />
                            <span>{op.freqCoarse}</span> {/* Display current value */}
                        </div>

                    </div>
                </div> // index div
            ))}
        </form>
    )
}