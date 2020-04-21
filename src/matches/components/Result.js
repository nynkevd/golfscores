import React, {useState, useRef} from 'react';

import './Result.css';

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
            <div className="matchResult">
                <input ref={input} type="number" min="0" defaultValue="0" onBlur={updateScores} disabled={disabled}/>
                {/*<button onClick={setPlayerStatus}> {disabled ? "Speelde wel mee" : "Speelde niet mee"} </button>*/}
                <span className="checkbox" onClick={setPlayerStatus}> {!disabled ?
                    <i className="fas fa-check"> </i> : null} </span>
                {/*{disabled ? <i onClick={setPlayerStatus} className="fas fa-ban not-playing"> </i> : <i onClick={setPlayerStatus} class="fas fa-check playing"> </i>}*/}
            </div>


        </React.Fragment>
    );
};

export default Result;