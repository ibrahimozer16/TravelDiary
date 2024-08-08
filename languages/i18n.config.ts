import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { tr, en, de, sp } from './translations';

const resources = {
    tr: {
        translation: tr,
    },
    en: {
        translation: en,
    },
    de: {
        translation: de,
    },
    sp: {
        translation: sp,
    }
}

i18next.use(initReactI18next).init({
    debug: false,
    lng: 'tr',
    compatibilityJSON: 'v3',
    fallbackLng: 'tr',
    resources,
})

export default i18next;