import { AxiosMiddleWear, AxiosManagerRequestConfig, AxiosManagerResponse } from "./AxiosManager";
import axios from 'axios';

export class AxiosAddCancelToAllQuery extends AxiosMiddleWear {
    constructor() {
        super();
    }
    onRequest(config: AxiosManagerRequestConfig) {
            var CancelToken = axios.CancelToken;
            var source = CancelToken.source();
            config.cancelToken = source.token;
        return config;
    }
}



