/*
 * action types
 */
export const SET_OPTIONS = 'set-options'
export const CHANGE_LANGUAGE = 'change-language'
export const CHANGE_COLOR = 'change-color'
export const CHANGE_LINE_WIDTH = 'change-line-width'
export const CHANGE_COMMAND_TEXT_ON = 'change-command-text-on'
export const CHANGE_ACTION_TEXT_ON = 'change-action-text-on'
export const CHANGE_TRAIL_ON = 'change-trail-on'
export const CHANGE_GESTURE = 'change-gesture'

/*
 * action creators
 */
export function setOptions(rawOptions: object) {
    return {
        type: SET_OPTIONS,
        rawOptions
    } as const
}
export function changeLanguage(language: string) {
    return {
        type: CHANGE_LANGUAGE,
        language
    } as const
}
export function changeColor(color: string) {
    return {
        type: CHANGE_COLOR,
        color
    } as const
}
export function changeLineWidth(width: number) {
    return {
        type: CHANGE_LINE_WIDTH,
        width
    } as const
}

export function changeCommandTextOn(isOn: boolean) {
    return {
        type: CHANGE_COMMAND_TEXT_ON,
        isOn
    } as const
}

export function changeActionTextOn(isOn: boolean){
    return {
        type: CHANGE_ACTION_TEXT_ON,
        isOn
    } as const
}

export function changeTrailOn(isOn: boolean) {
    return {
        type: CHANGE_TRAIL_ON,
        isOn
    } as const
}

export function changeGesture(name: string, gesture: string) {
    return {
        type: CHANGE_GESTURE,
        name,
        gesture
    } as const
}
