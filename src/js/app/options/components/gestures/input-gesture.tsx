import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../stores/reducers/reducers";
import {changeGesture} from "../../../stores/actions/options";
import ContentScripts from "../../../content/content_scripts";


export const InputGesture = function (props) {
    const dispatch = useDispatch();
    const options = useSelector((state: RootState) => state.options);
    const gestureName = props.gestureName
    const gestureText: string = options[gestureName]

    const handleChange = (newValue) => {
        dispatch(changeGesture(gestureName, newValue))
    }

    const setGestureText = gestureText ? ContentScripts.replaceCommandToArrow(gestureText) : '&nbsp;';

    return (
        <div style={{display: "inline-block"}}>
            <span className="views_gesture" dangerouslySetInnerHTML={{__html: setGestureText}}/>
            <input type="text" className="input is-small input_gesture"
                   value={gestureText}
                   onChange={(event) => {
                       handleChange(event.currentTarget.value)
                   }}
            />
            <button className="button is-small is-text reset_gesture"
                    onClick={() => {
                        handleChange('')
                    }}><a className="delete"/></button>
        </div>
    )
}

