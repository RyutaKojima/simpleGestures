import {combineReducers} from 'redux'
import i18n from "i18next";
import {
    CHANGE_ACTION_TEXT_ON,
    CHANGE_COLOR,
    CHANGE_COMMAND_TEXT_ON,
    CHANGE_LANGUAGE,
    CHANGE_LINE_WIDTH,
    CHANGE_TRAIL_ON,
    SET_OPTIONS,
    CHANGE_GESTURE
} from "../actions/options"
import {trimRange} from "../../utils";
import {OptionLanguage} from "../../Domain/ValueObjects/OptionLanguage";

const defaultOptionsState:{
    'language': 'Japanese'|'English',
    'color_code': string,
    'line_width': string|number,
    'command_text_on': boolean,
    'action_text_on': boolean,
    'trail_on': boolean,
    "gesture_close_tab": string,
    "gesture_forward": string,
    "gesture_back": string,
    "gesture_new_tab": string,
    "gesture_reload": string,
    "gesture_open_option": string,
    "gesture_open_extension": string,
    "gesture_reload_all": string,
    "gesture_pin_tab": string,
    "gesture_next_tab": string,
    "gesture_prev_tab": string,
    "gesture_scroll_top": string,
    "gesture_scroll_bottom": string,
    "gesture_new_tab_background": string,
    "gesture_last_tab": string,
    "gesture_close_left_tab_without_pinned": string,
    "gesture_close_right_tab_without_pinned": string,
    "gesture_close_all_background": string,
    "gesture_close_all": string,
    "gesture_close_left_tab": string
    "gesture_close_right_tab": string
} = {
    'language': 'Japanese',
    'color_code': '#FF0000',
    'line_width': '3',
    'command_text_on': true,
    'action_text_on': true,
    'trail_on': true,
    "gesture_close_tab": '',
    "gesture_forward": '',
    "gesture_back": '',
    "gesture_new_tab": '',
    "gesture_reload": '',
    "gesture_open_option": '',
    "gesture_open_extension": '',
    "gesture_reload_all": '',
    "gesture_pin_tab": '',
    "gesture_next_tab": '',
    "gesture_prev_tab": '',
    "gesture_scroll_top": '',
    "gesture_scroll_bottom": '',
    "gesture_new_tab_background": '',
    "gesture_last_tab": '',
    "gesture_close_left_tab_without_pinned": '',
    "gesture_close_right_tab_without_pinned": '',
    "gesture_close_all_background": '',
    "gesture_close_all": '',
    "gesture_close_left_tab": '',
    "gesture_close_right_tab": ''
}

function options(state = defaultOptionsState, action) {
    switch (action.type) {
        case SET_OPTIONS:
            return {
                ...state,
                ...action.rawOptions
            }
        case CHANGE_LANGUAGE:
            const language = new OptionLanguage(action.language)
            i18n.changeLanguage(language.i18())

            return {
                ...state,
                language: language.language()
            }
        case CHANGE_COLOR:
            return {
                ...state,
                'color_code': action.color,
            }
        case CHANGE_LINE_WIDTH:
            return {
                ...state,
                'line_width': trimRange(1, 15, action.width)
            }
        case CHANGE_COMMAND_TEXT_ON:
            return {
                ...state,
                'command_text_on': action.isOn
            }
        case CHANGE_ACTION_TEXT_ON:
            return {
                ...state,
                'action_text_on': action.isOn
            }
        case CHANGE_TRAIL_ON:
            return {
                ...state,
                'trail_on': action.isOn
            }
        case CHANGE_GESTURE:
            return {
                ...state,
                [action.name]: action.gesture
            }
    }

    return state
}

const rootReducer = combineReducers({
    options
})

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>