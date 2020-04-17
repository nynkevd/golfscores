import React, {useState, useRef} from 'react';

const Result = props => {

    const [disabled, setDisabled] = useState(false);
    const input = useRef(null);

    const setPlayerStatus = () => {
        setDisabled(!disabled);
        if (!disabled) {
            props.setScores({
                ...props.scores,
                [props.playerId]: null
            });
        } else {
            props.setScores({
                ...props.scores,
                [props.playerId]: input.current.value
            });
        }

    };

    const updateScores = (event) => {
        props.setScores({
            ...props.scores,
            [props.playerId]: event.target.value || null
        })
    };

    return (
        <React.Fragment>

            <p className={disabled ? "disabled" : null}> {props.name} </p>
            <input ref={input} type="number" min="0" defaultValue="0" onBlur={updateScores} disabled={disabled}/>
            <button onClick={setPlayerStatus}> {disabled ? "Speelde wel mee" : "Speelde niet mee"} </button>

        </React.Fragment>
    );
};

export default Result;