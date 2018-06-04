
import { AxiosMiddleWear, AxiosManagerRequestConfig, AxiosManagerResponse , AxiosManagerError} from "./AxiosManager";
import axios, { CancelToken, CancelTokenStatic, AxiosStatic, AxiosRequestConfig, AxiosResponse, AxiosError, CancelTokenSource } from 'axios';

export class AxiosCancelCurrent extends AxiosMiddleWear {
    configs: { [url: string]: boolean } = {};

    constructor() {
        super();
    }
    i=0;
    onRequest(config: AxiosManagerRequestConfig) {
        (config as any).id = this.i++;
        if (config.url && this.configs[config.url]) {
            var CancelToken = axios.CancelToken;
            var source = CancelToken.source();
            config.cancelToken = source.token;
            source.cancel('Operation canceled by the user.');
            this.log("cancel "+this.i+": " + config.url, "red");
        }

        if (config.url) {
            this.configs[config.url] = true;
        }

        return config;
    }
    onResponse(response: AxiosManagerResponse) {
        
        this.$removeConfigOnResponse(response.config);
        return response;
    }
    onResponseError(error: AxiosManagerError) {
        var canceled = axios.isCancel(error);
        if(!canceled){
            this.$removeConfigOnResponse(error.config);
        }
        return error;
    }

    $removeConfigOnResponse(config: AxiosRequestConfig) {
        if (config && config.url) {
            delete this.configs[config.url];
        }
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