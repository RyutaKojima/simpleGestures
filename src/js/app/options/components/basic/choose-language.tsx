import React from "react";

export default function ChooseLanguage(props) {
    const handleClick = (lang) => {
        props.onClick(lang)
    }

    return (
        <div>
            <label htmlFor="languageEnglish" className="radio">
                <input type="radio" name="language" value="English" id="languageEnglish"
                       checked={props.value === 'English'}
                       onChange={() => handleClick('English')}/>
                English
            </label>
            <label htmlFor="languageJapanese" className="radio">
                <input type="radio" name="language" value="Japanese" id="languageJapanese"
                       checked={props.value === 'Japanese'}
                       onChange={() => handleClick('Japanese')}/>
                日本語
            </label>
        </div>
    )
}