import React from "react";
import {useDispatch, useSelector} from "react-redux"
import {useTranslation} from "react-i18next";
import ColorPicker from 'material-ui-color-picker'
import ChooseLanguage from "./basic/choose-language"
import {
    changeActionTextOn,
    changeColor,
    changeCommandTextOn,
    changeLanguage,
    changeLineWidth,
    changeTrailOn
} from "../../stores/actions/options"

export function ContentBasic(props) {
    const [t] = useTranslation()
    const dispatch = useDispatch();
    const options = props.options;

    return (
        <table className="table">
            <tbody>
            <tr>
                <th>
                    <span>{t('language-settings')}</span>
                </th>
                <td>
                    <div className="field">
                        <div className="control">
                            <ChooseLanguage value={options.language}
                                            onClick={(language) => dispatch(changeLanguage(language))}/>
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <th>
                    <span>{t('general-line-color')}</span>
                </th>
                <td>
                    <div className="field">
                        <div className="control">
                            <ColorPicker
                                name='color'
                                value={options.color_code}
                                hintText={options.color_code}
                                onChange={(color) => dispatch(changeColor(color))}
                            />
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <th>
                    <span>{t('general-line-width')}</span>
                </th>
                <td>
                    <div className="field has-addons">
                        <div className="control">
                            <input className="input" type="number" id="line_width"
                                   value={options.line_width}
                                   onChange={(event) => dispatch(changeLineWidth(Number(event.currentTarget.value)))}/>
                        </div>
                        <div className="control">
                            <a className="button is-static">
                                px
                            </a>
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <th>
                    <span>{t('general-view-gesture-text')}</span>
                </th>
                <td>
                    <label className="checkbox">
                        <input className="checkbox" type="checkbox" id="command_text_on"
                               checked={options.command_text_on}
                               onChange={event => dispatch(changeCommandTextOn(event.currentTarget.checked))}
                        />
                        <span>{t('display-when-checked')}</span>
                    </label>
                </td>
            </tr>
            <tr>
                <th>
                    <span>{t('general-view-gesture-action')}</span>
                </th>
                <td>
                    <label className="checkbox">
                        <input className="checkbox" type="checkbox" id="action_text_on"
                               checked={options.action_text_on}
                               onChange={event => dispatch(changeActionTextOn(event.currentTarget.checked))}
                        />
                        <span>{t('display-when-checked')}</span>
                    </label>
                </td>
            </tr>
            <tr>
                <th>
                    <span>{t('general-view-gesture-trail')}</span>
                </th>
                <td>
                    <label className="checkbox">
                        <input className="checkbox" type="checkbox" id="trail_on"
                               checked={options.trail_on}
                               onChange={event => dispatch(changeTrailOn(event.currentTarget.checked))}
                        />
                        <span>{t('display-when-checked')}</span>
                    </label>
                </td>
            </tr>
            </tbody>
        </table>
    )
}