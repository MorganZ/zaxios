
import {AxiosMiddleWear} from './AxiosManager';

export class AxiosLogger extends AxiosMiddleWear {
    constructor(silent = true) {
        super();
        var getLogFunction = (scope: string, color?: string) =>
            (arg: any) => {
                let url = arg.url || arg.config.url;
                this.log(url + " > " + scope, color);
                if (!silent) console.log(arg)
                return arg;
            }

        this.onRequest = getLogFunction("onRequest", "orange");
        this.onRequestError = getLogFunction("onRequestError", "red");
        this.onResponse = getLogFunction("onResponse");
        this.onResponseError = getLogFunction("onResponseError", "red");
    }
}