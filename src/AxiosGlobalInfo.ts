
import { AxiosMiddleWear, AxiosManagerRequestConfig, AxiosManagerResponse , AxiosManagerError} from "./AxiosManager";
import axios, { CancelToken, CancelTokenStatic, CancelTokenSource } from 'axios';

class HttpRequestInfo {
    pending: number = 0;
    success: number = 0;
    error: number = 0;
    done: number = 0;
}

var ExtractUrl = function(url: string) {
    var index = url.indexOf("?");
    return index > -1 ? url.substring(0, url.indexOf("?")) : url;
}

export class AxiosGlobalInfo extends AxiosMiddleWear {

    GlobalStats: HttpRequestInfo = new HttpRequestInfo();
    StatByRequest: { [url: string]: HttpRequestInfo } = {};

    constructor() {
        super();
    }

    onRequest(config: AxiosManagerRequestConfig) {
        this.infoLaunch(config)
        return config;
    }

    onRequestError(error: AxiosManagerError) {
        this.infoError(error);
        return error;
    }

    onResponse(response: AxiosManagerResponse) {
        this.infoComplete(response);
        return response;
    }

    onResponseError(error: AxiosManagerError) {
        this.infoError(error);
        return error;
    }



    infoLaunch(config: AxiosManagerRequestConfig) {
        if (config.url) {
            var url = ExtractUrl(config.url);
            if (!this.StatByRequest[url]) {
                this.StatByRequest[url] = new HttpRequestInfo();
            }
            let statCurrent = this.StatByRequest[url];
            statCurrent.pending++;
            this.GlobalStats.pending++;
        }
    }

    infoError(error: AxiosManagerError) {
        let config = error.config;
        if (config && config.url) {
            var url = ExtractUrl(config.url);
            let statCurrent = this.StatByRequest[url];
            statCurrent.error++;
            statCurrent.done++;
            statCurrent.pending--;
        }
        this.GlobalStats.error++;
        this.GlobalStats.done++;
        this.GlobalStats.pending--;
    }

    infoComplete(response: AxiosManagerResponse) {
        let config = response.config;
        if (config.url) {
            var url = ExtractUrl(config.url);
            let statCurrent = this.StatByRequest[url];
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