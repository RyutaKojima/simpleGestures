import React from "react";
import {useTranslation} from "react-i18next";

export function ContentDanger() {
    const [t] = useTranslation()
    return (
        <div className="box" style={{border: "solid 1px red"}}>
            <button id="reset_all" className="button is-danger is-outlined">
                <a className="delete"/>
                <span>{t('danger-reset-all-options')}</span>
            </button>
        </div>
    )
}