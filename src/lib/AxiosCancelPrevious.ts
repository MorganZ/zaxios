import { AxiosMiddleWear, AxiosManagerRequestConfig, AxiosManagerResponse , AxiosManagerError} from "./AxiosManager";
import axios, { CancelToken, CancelTokenStatic, CancelTokenSource } from 'axios';


export class AxiosCancelPrevious extends AxiosMiddleWear {
    configs: { [url: string]: CancelTokenSource } = {};

    constructor() {
        super();
    }

    onRequest(config: AxiosManagerRequestConfig) {
        if (config.url && this.configs[config.url]) {
            this.configs[config.url].cancel({config: config,cancelmessage:"axios cancel message" } as any);
            this.log("cancel " + config.url, "red")
        }

        if (config.url) {
            var CancelToken = axios.CancelToken;
            var source = CancelToken.source();
            config.cancelToken = source.token;
            this.configs[config.url] = source;
        }
        return config;
    }
    onResponse(response: AxiosManagerResponse) {
        return response;
    }
    onResponseError(error: AxiosManagerError) {
        return error
    }
}