import { createStore } from 'vuex';

export default createStore({
    state: {
        language: localStorage.getItem('language') || 'english',
    },
    mutations: {
        setLanguage(state, language) {
            state.language = language;
            localStorage.setItem('language', language);
        },
    },
});