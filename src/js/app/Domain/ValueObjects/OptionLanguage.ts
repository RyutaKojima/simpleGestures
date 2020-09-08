export class OptionLanguage {
    private readonly lang: 'Japanese'|'English';

    constructor(langLabel: 'Japanese'|'English') {
        this.lang = langLabel
    }

    language(): 'Japanese'|'English' {
        return this.lang
    }

    i18(): 'ja'|'en' {
        return this.lang === 'Japanese' ? 'ja' : 'en'
    }
}