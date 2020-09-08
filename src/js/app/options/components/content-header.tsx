import React from "react";
import {useTranslation} from "react-i18next";

export function ContentHeader() {
    const [ t ] = useTranslation();
    return (
        <div>
            <h3 className="title is-3">
                <span>{t('app-option-title')}</span>
            </h3>
            <div className="notification" style={{padding: "0.5em", marginBottom: "0.5em"}}>
                <span>{t('app-option-notification')}</span>
            </div>
        </div>
    )
}