declare function isIE(): number | undefined;

interface Window {
    isIE(): number | undefined;
}

declare module '*.vue' {
    import Vue from 'vue'
    export default Vue
}