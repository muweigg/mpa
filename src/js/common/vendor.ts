// import 'script-loader!babel-loader!./third-party/Rx';
import 'script-loader!./third-party/rxjs.umd.min';
import 'script-loader!lodash/lodash.min';
import 'script-loader!vue/dist/vue.min';
import 'script-loader!axios/dist/axios.min';
import 'script-loader!jquery/dist/jquery.slim.min';

window.isIE = () => {
    let match = navigator.userAgent.match(/(?:MSIE |Trident\/.*; rv:)(\d+)/);
    return match ? parseInt(match[1]) : undefined;
}