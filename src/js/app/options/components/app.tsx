import React, {useEffect} from "react";
import {ContentHeader} from "./content-header";
import {ContentBasic} from "./content-basic";
import {ContentGestures} from "./content-gestures";
import {ContentDanger} from "./content-danger";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../stores/reducers/reducers";
import MyStorage from "../../storage";

export function App() {
    const [t] = useTranslation();
    const options = useSelector((state: RootState) => state.options);

    const saveOptions = (options: object) => {
        const storage = new MyStorage(MyStorage.CHROME_STORAGE_LOCAL);
        const LOCAL_STORAGE_KEY = 'options';
        const saveRawData: string = JSON.stringify(options);
        storage.save(LOCAL_STORAGE_KEY, saveRawData);

        chrome.runtime.sendMessage({msg: 'reload_option'}, () => {
        })
    }

    useEffect(() => {
        saveOptions(options)
    }, [options])

    return (
        <section className="section" style={{paddingTop: "1.5rem"}}>
            <div className="container">
                <ContentHeader/>

                <div className="box color-lightblue">
                    <span>{t('tab-basic-settings')}</span>
                    <ContentBasic options={options} />
                </div>
                
                <div className="box color-yellow">
                    <span>{t('tab-gesture-settings')}</span>
                    <ContentGestures options={options} />
                </div>

                <ContentDanger/>
            </div>
        </section>
    );
}
