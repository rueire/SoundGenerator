import { useState, useEffect } from "react";

// to help randomizing
export const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export default function ParameterForm({ onChange }) {
    //These params are taken from user
    const [params, setParams] = useState({
        patchName: 'patch',
        algorithm: 1, // 1-32
        feedback: 1, // 0-7
        pitchSensitivity: 7, //0-7
        operatorParams: Array(6).fill().map(() => ({
            oscillatorMode: 0, // 0-1
            output_level: 80, // 0-99
            rateScaling: 2, // 0-7
            eg_rate1: 1, // 0-99
            eg_rate2: 1, // 0-99
            eg_rate3: 1, // 0-99
            eg_rate4: 1, // 0-99
            eg_level1: 1, // 0-99
            eg_level2: 1, // 0-99
            eg_level3: 1, // 0-99
            eg_level4: 1, // 0-99
            selectedEG: 0,
        }))
    });

    // eg presets for envelope values
    const egPresets = {
        0: {
            eg_rate1: randomBetween(90, 99),
            eg_rate2: randomBetween(85, 95),
            eg_rate3: randomBetween(80, 90),
            eg_rate4: randomBetween(60, 80),

            eg_level1: 99,
            eg_level2: randomBetween(85, 95),
            eg_level3: randomBetween(80, 90),
            eg_level4: 0
        },
        1: {
            eg_rate1: randomBetween(70, 80),
            eg_rate2: randomBetween(60, 70),
            eg_rate3: randomBetween(40, 50),
            eg_rate4: randomBetween(20, 40),

            eg_level1: 99,
            eg_level2: randomBetween(70, 85),
            eg_level3: randomBetween(50, 70),
            eg_level4: 0
        },
        2: {
            eg_rate1: randomBetween(40, 65),
            eg_rate2: randomBetween(40, 55),
            eg_rate3: randomBetween(20, 40),
            eg_rate4: randomBetween(10, 20),
            
            eg_level1: 99,
            eg_level2: randomBetween(60, 80),
            eg_level3: randomBetween(40, 60),
            eg_level4: 0
        }
    };

    //Handle basic Parameters
    const handleInput = (e) => {
        const { name, value } = e.target;
        setParams((prev) => ({
            //name: Hakee kentän nimen, joka on määritetty name-attribuutilla (esim. name="algorithm")
            ...prev,
            [name]: isNaN(value) ? String(value) : Number(value),
        }));
    }

    //Handle Operator Parameters
    const handleOperatorInput = (index, e) => {

        setParams((prev) => {
            // console.log(params.operatorParams[index]); // debug
            const updatedOperators = [...prev.operatorParams];
            updatedOperators[index][e.target.name] = parseInt(e.target.value, 10);

            return {
                ...prev,
                operatorParams: updatedOperators,
            };
        });
    };

    //handle EG changes
    const handleEGChange = (index, e) => {
        const chosenValue = parseInt(e.target.value, 10);

        setParams((prev) => {
            const updatedOperators = [...prev.operatorParams];
            updatedOperators[index] = {
                ...updatedOperators[index],
                ...egPresets[chosenValue],
                selectedEG: chosenValue
                
            };
            // below are debugs
            // console.log("Applying EG preset", chosenValue, "to operator", index);
            
            return {
                ...prev,
                operatorParams: updatedOperators
            };
        })
        console.log(egPresets[chosenValue]);
    }

    // useEffect to keep up w/parameter changes
    useEffect(() => {
        onChange(params);
    }, [params, onChange]);

    // useEffect to make sure eg preset values are there when page loads
    useEffect(() => {
        setParams((prev) => {
            const updatedOperators = prev.operatorParams.map((op) => ({
                ...op,
                ...egPresets[0], //  set preset 0 as default
                selectedEG: 0,
            }));
            return { ...prev, operatorParams: updatedOperators };
        });
    }, []); //empty dependency array: runs only once

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
                <div className="patchName-container">
                    <label htmlFor="patchName">Name:</label>
                    <input
                        type="text"
                        name="patchName"
                        maxLength={10}
                        placeholder="Patch Name(max 10 letters)"
                        onChange={handleInput}
                    />
                </div>
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
                        <div className="container">
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
                        <div className="EG-container">
                                <label htmlFor="EG-values">EG:</label>
                                <select
                                    name="eg-values"
                                    value={op.selectedEG}
                                    onChange={(e) => handleEGChange(index, e)}
                                >
                                    <option value={0}>High and Fast</option>
                                    <option value={1}>Medium</option>
                                    <option value={2}>Slow and Steady</option>
                                </select>
                        </div>
                    </div>
                </div> // index div
            ))}
        </form>
    )
}