import React from "react"
import {render} from "react-dom"
import {createStore} from "redux"
import {Provider} from "react-redux";
import i18n from "i18next"
import {initReactI18next} from "react-i18next";
import {App} from "./components/app"
import resources from "../locales/resources";
import appReducer from "../stores/reducers/reducers"
import LibOption from "../lib_option";
import {setOptions} from "../stores/actions/options"
import {OptionLanguage} from "../Domain/ValueObjects/OptionLanguage";

const option: LibOption = new LibOption();

const store = createStore(appReducer)

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        lng: 'en',
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        },
        react: {
            useSuspense: false
        }
    });
i18n.addResourceBundle('ja', 'translation', resources.ja.translation)
i18n.addResourceBundle('en', 'translation', resources.en.translation)

window.addEventListener('DOMContentLoaded', async (event) => {
    render(
        <Provider store={store}>
            <App/>
        </Provider>,
        document.getElementById('app'));

    await option.load()
    const rawOption = option.getRawStorageData()
    store.dispatch(setOptions(JSON.parse(rawOption)))

    // NOTE: 同じメソッド内で呼ぶと`i18n.changeLanguage`が反映されなかったので別のイベントで処理しています
    setTimeout(() => {
        const language = new OptionLanguage(store.getState().options.language)
        i18n.changeLanguage(language.i18())
    }, 1)
});

/**
 * コンテキストメニューの呼び出しをされたときに実行されるイベント。
 * falseを返すと、コンテキストメニューを無効にする。
 */
document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});