import { AxiosMiddleWear, AxiosManagerRequestConfig, AxiosManagerResponse , AxiosManagerError} from "./AxiosManager";
import axios, { CancelToken, CancelTokenStatic, CancelTokenSource } from 'axios';


export class AxiosCancelPrevious extends AxiosMiddleWear {
    public configs: { [url: string]: CancelTokenSource } = {};

    constructor() {
        super();
    }

    public onRequest(config: AxiosManagerRequestConfig) {
        if (config.url && this.configs[config.url]) {
            this.configs[config.url].cancel({config, cancelmessage: "axios cancel message" } as any);
            this.log("cancel " + config.url, "red");
        }

        if (config.url) {
            const cancelToken = axios.CancelToken;
            const source = cancelToken.source();
            config.cancelToken = source.token;
            this.configs[config.url] = source;
        }
        return config;
    }
    public onResponse(response: AxiosManagerResponse) {
        return response;
    }
    public onResponseError(error: AxiosManagerError) {
        return error;
    }
}
