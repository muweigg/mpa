declare function isIE(): number | undefined;

interface Window {
    isIE(): number | undefined;
}