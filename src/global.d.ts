declare function isIE(): number | undefined;
declare var rxjs: any;

interface Window {
    isIE(): number | undefined;
}