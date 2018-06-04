
import { AxiosMiddleWear, AxiosManagerRequestConfig, AxiosManagerResponse , AxiosManagerError} from "./AxiosManager";
import axios, { CancelToken, CancelTokenStatic, CancelTokenSource } from 'axios';

class HttpRequestInfo {
    public pending: number = 0;
    public success: number = 0;
    public error: number = 0;
    public done: number = 0;
}

const ExtractUrl = (url: string)  => {
    const index = url.indexOf("?");
    return index > -1 ? url.substring(0, url.indexOf("?")) : url;
};

export class AxiosGlobalInfo extends AxiosMiddleWear {

    public GlobalStats: HttpRequestInfo = new HttpRequestInfo();
    public StatByRequest: { [url: string]: HttpRequestInfo } = {};

    constructor() {
        super();
    }

    public onRequest(config: AxiosManagerRequestConfig) {
        this.infoLaunch(config);
        return config;
    }

    public onRequestError(error: AxiosManagerError) {
        this.infoError(error);
        return error;
    }

    public onResponse(response: AxiosManagerResponse) {
        this.infoComplete(response);
        return response;
    }

    public onResponseError(error: AxiosManagerError) {
        this.infoError(error);
        return error;
    }



    public infoLaunch(config: AxiosManagerRequestConfig) {
        if (config.url) {
            const url = ExtractUrl(config.url);
            if (!this.StatByRequest[url]) {
                this.StatByRequest[url] = new HttpRequestInfo();
            }
            const statCurrent = this.StatByRequest[url];
            statCurrent.pending++;
            this.GlobalStats.pending++;
        }
    }

    public infoError(error: AxiosManagerError) {
        const config = error.config;
        if (config && config.url) {
            const url = ExtractUrl(config.url);
            const statCurrent = this.StatByRequest[url];
            statCurrent.error++;
            statCurrent.done++;
            statCurrent.pending--;
        }
        this.GlobalStats.error++;
        this.GlobalStats.done++;
        this.GlobalStats.pending--;
    }

    public infoComplete(response: AxiosManagerResponse) {
        const config = response.config;
        if (config.url) {
            const url = ExtractUrl(config.url);
            const statCurrent = this.StatByRequest[url];
            statCurrent.success++;
            statCurrent.done++;
            statCurrent.pending--;
        }
        this.GlobalStats.success++;
        this.GlobalStats.done++;
        this.GlobalStats.pending--;
    }
}



// interface ZAxiosRequestConfig extends AxiosRequestConfig {
//     id: number;
// }

// getNewId() {
//     this.ids++;
//     return this.ids;
// }

// PushConfig(config: ZAxiosRequestConfig) {
//     config.id = this.getNewId();
//     var previousToken: CancelTokenStatic = this.axios.CancelToken;
//     var source = previousToken.source();
//     config.cancelToken = source.token;
//     this.configs[config.id] = config;
//     this.allConfigs[config.id] = config;
//     //   source.cancel();
// }

// RemoveConfig(config: ZAxiosRequestConfig) {
//     delete this.configs[config.id];
// }
