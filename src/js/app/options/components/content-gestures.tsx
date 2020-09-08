import React from "react";
import {useTranslation} from "react-i18next";
import {InputGesture} from "./gestures/input-gesture";

export function ContentGestures(props) {
    const [t] = useTranslation()

    return (
        <table className="table is-narrow is-hoverable">
            <thead>
            <tr>
                <th>
                    <span>{t('gesture-action-name')}</span>
                </th>
                <th>
                    <span>{t('gesture-command')}</span>
                </th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <th>
                    gesture_new_tab
                </th>
                <td>
                    <InputGesture gestureName={'gesture_new_tab'} />
                </td>
            </tr>
            <tr>
                <th>
                    gesture_new_tab_background
                </th>
                <td>
                    <InputGesture gestureName={'gesture_new_tab_background'} />
                </td>
            </tr>
            <tr>
                <th>
                    gesture_pin_tab
                </th>
                <td>
                    <InputGesture gestureName={'gesture_pin_tab'} />
                </td>
            </tr>
            <tr>
                <th>
                    gesture_reload
                </th>
                <td>
                    <InputGesture gestureName={'gesture_reload'} />
                </td>
            </tr>
            <tr>
                <th>
                    gesture_reload_all
                </th>
                <td>
                    <InputGesture gestureName={'gesture_reload_all'} />
                </td>
            </tr>
            <tr>
                <th>
                    gesture_forward
                </th>
                <td>
                    <InputGesture gestureName={'gesture_forward'} />
                </td>
            </tr>
            <tr>
                <th>
                    gesture_back
                </th>
                <td>
                    <InputGesture gestureName={'gesture_back'} />
                </td>
            </tr>
            <tr>
                <th>
                    gesture_scroll_top
                </th>
                <td>
                    <InputGesture gestureName={'gesture_scroll_top'} />
                </td>
            </tr>
            <tr>
                <th>
                    gesture_scroll_bottom
                </th>
                <td>
                    <InputGesture gestureName={'gesture_scroll_bottom'} />
                </td>
            </tr>
            <tr>
                <th>
                    gesture_next_tab
                </th>
                <td>
                    <InputGesture gestureName={'gesture_next_tab'} />
                </td>
            </tr>
            <tr>
                <th>
                    gesture_prev_tab
                </th>
                <td>
                    <InputGesture gestureName={'gesture_prev_tab'} />
                </td>
            </tr>
            <tr>
                <th>
                    gesture_last_tab
                </th>
                <td>
                    <InputGesture gestureName={'gesture_last_tab'} />
                </td>
            </tr>
            <tr>
                <th>
                    gesture_close_tab
                </th>
                <td>
                    <InputGesture gestureName={'gesture_close_tab'} />
                </td>
            </tr>
            <tr>
                <th>
                    gesture_close_left_tab_without_pinned
                </th>
                <td>
                    <InputGesture gestureName={'gesture_close_left_tab_without_pinned'} />
                </td>
            </tr>
            <tr>
                <th>
                    gesture_close_right_tab_without_pinned
                </th>
                <td>
                    <InputGesture gestureName={'gesture_close_right_tab_without_pinned'} />
                </td>
            </tr>
            <tr>
                <th>
                    gesture_close_left_tab
                </th>
                <td>
                    <InputGesture gestureName={'gesture_close_left_tab'} />
                </td>
            </tr>
            <tr>
                <th>
                    gesture_close_right_tab
                </th>
                <td>
                    <InputGesture gestureName={'gesture_close_right_tab'} />
                </td>
            </tr>
            <tr>
                <th>
                    gesture_close_all_background
                </th>
                <td>
                    <InputGesture gestureName={'gesture_close_all_background'} />
                </td>
            </tr>
            <tr>
                <th>
                    gesture_close_all
                </th>
                <td>
                    <InputGesture gestureName={'gesture_close_all'} />
                </td>
            </tr>
            <tr>
                <th>
                    gesture_open_extension
                </th>
                <td>
                    <InputGesture gestureName={'gesture_open_extension'} />
                </td>
            </tr>
            <tr>
                <th>
                    gesture_open_option
                </th>
                <td>
                    <InputGesture gestureName={'gesture_open_option'} />
                </td>
            </tr>

            {/*<tr>*/}
            {/*    <th>*/}
            {/*        gesture_restart*/}
            {/*    </th>*/}
            {/*    <td>*/}
            {/*        <span className="views_gesture"/>*/}
            {/*        <input type="text" className="input is-small input_gesture"*/}
            {/*               id="gesture_restart"/>*/}
            {/*        <button className="button is-small is-text reset_gesture"*/}
            {/*                data-target="gesture_restart"><a className="delete"/></button>*/}
            {/*    </td>*/}
            {/*</tr>*/}

            </tbody>
        </table>
    )
}