import { AxiosMiddleWear, AxiosManagerRequestConfig, AxiosManagerResponse } from "./AxiosManager";
import axios from 'axios';

export class AxiosAddCancelToAllQuery extends AxiosMiddleWear {
    constructor() {
        super();
    }
    public onRequest(config: AxiosManagerRequestConfig) {
            const CancelToken = axios.CancelToken;
            const source = CancelToken.source();
            config.cancelToken = source.token;
            return config;
    }
}



