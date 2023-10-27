import {sprintf} from 'sprintf-js';
import * as deDE from '../translations/de-DE.json';
import * as enGB from '../translations/en-GB.json';

export enum Languages
{
    german  = 'deDE',
    english = 'enGB'
}

export class LangManager
{
    private static language: Languages;
    private static availLang = {deDE, enGB};

    /**
     * Setter method to set current language to provided RFC 3066 code
     * Fallback language code: english
     *
     * @param {Languages} langCode Language code RFC 3066
     */
    public static setLanguage(langCode: Languages): void
    {
        if (!langCode)
        {
            langCode = Languages.english;
        }

        this.language = langCode;
    }

    /**
     * Get current language as string or as RFC 3066
     *
     * @param {boolean} asString If true returns current language as language string
     * @return {string} RFC 3066 or translated language key
     */
    public static getLanguage(asString: boolean = false): string | Languages
    {
        if (asString)
        {
            switch (this.language)
            {
                case Languages.german:
                    return this.get('LANGUAGE_MANAGER_GERMAN');
                case Languages.english:
                    return this.get('LANGUAGE_MANAGER_ENGLISH');
            }
        }

        return this.language;
    }

    /**
     * Returns translation for a specific language key. If it does not exist, the key itself will be returned.
     * It is possible to provide arguments which can get interpolated into the translation.
     *
     * @param {string} key Language key
     * @param args Arguments for interpolation
     * @returns {string} Translation or key itself
     */
    public static get(key: string, ...args: any[]): string
    {
        if (key === null || key === undefined)
        {
            return '';
        }

        const language = this.availLang[this.language] as any;
        const translation: string = language && language[key];

        if (translation === undefined)
        {
            return key;
        }

        if (args.length > 0)
        {
            return sprintf(translation, ...args);
        }

        return translation;
    }
}
