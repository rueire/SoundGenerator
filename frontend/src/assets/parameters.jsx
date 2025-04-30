import { useState, useEffect } from "react";

export default function ParameterForm({ onChange }) {
    // const [lfoWaveform, setLfoWaveform] = useState(0);
    // const [xmlBlob, setXmlBlob] = useState(null); // xml to send

    //These params are taken from user
    const [params, setParams] = useState({
        algorithm: 1, // 1-32
        feedback: 1, // 0-7
        pitchSensitivity: 7, //0-7
        operatorParams: Array(6).fill().map(() => ({
            oscillatorMode: 1, // 0-1
            output_level: 80, // 0-99
            rateScaling: 2, // 0-7
            eg_rate1: 1, // 0-99
            eg_rate4: 1, // 0-99
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
                <div className="feedback-container">
                    <label htmlFor="feedback">Feedback:</label>
                    <input
                        type="range"
                        id="feedback"
                        name="feedback"
                        min="0"
                        max="7"
                        step="1"
                        value={params.feedback}
                        onChange={handleInput}
                    /><span>{params.feedback}</span> {/* Display current value */}
                </div>
                {/* LFO Speed Slider */}
                <div className="pitchSensitivity-container">
                    <label htmlFor="pitchSensitivity">Pitch Mod Sensitivity:</label>
                    <input
                        type="range"
                        name="pitchSensitivity"
                        min="0"
                        max="7"
                        value={params.pitchSensitivity}
                        onChange={handleInput}
                    />
                    <span>{params.pitchSensitivity}</span> {/* Display current value */}
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
                            <label htmlFor="output_level">Output Level:</label>
                            <input
                                type="range"
                                name="output_level"
                                min="0"
                                max="99"
                                value={op.output_level}
                                onChange={(e) => handleOperatorInput(index, e)}
                            />
                            <span>{op.output_level}</span> {/* Display current value */}
                        </div>
                        <div className="rateScaling-container">
                            <label htmlFor="rateScaling">Rate Scaling:</label>
                            <input
                                type="range"
                                name="rateScaling"
                                min="0"
                                max="7"
                                value={params.operatorParams.rateScaling}
                                onChange={(e) => handleOperatorInput(index, e)}
                            />
                            <span>{op.rateScaling}</span> {/* Display current value */}
                        </div>
                        <div className="eg_rate_container">
                            <div className="eg_rate1-container">
                                <label htmlFor="eg_rate1">EG rate1:</label>
                                <input
                                    type="range"
                                    name="eg_rate1"
                                    min="0"
                                    max="99"
                                    value={op.eg_rate1}
                                    onChange={(e) => handleOperatorInput(index, e)}
                                />
                                <span>{op.eg_rate1}</span> {/* Display current value */}
                            </div>
                            <div className="eg_rate4-container">
                                <label htmlFor="eg_rate4">EG rate2:</label>
                                <input
                                    type="range"
                                    name="eg_rate4"
                                    min="0"
                                    max="99"
                                    value={op.eg_rate4}
                                    onChange={(e) => handleOperatorInput(index, e)}
                                />
                                <span>{op.eg_rate4}</span> {/* Display current value */}
                            </div>
                        </div>
                    </div>
                </div> // index div
            ))}
        </form>
    )
}