import Axios, { CancelToken, CancelTokenStatic, AxiosStatic, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export interface AxiosManagerRequestConfig extends AxiosRequestConfig {id:number, meta:any}
export interface AxiosManagerResponse extends AxiosResponse {
    config:AxiosManagerRequestConfig;
}
export interface AxiosManagerError extends AxiosError{
    config:AxiosManagerRequestConfig;
}

var log = (sender: string, message: string, color: string = "#41b883") => {
    console.log(`%c ${sender} %c ${message} %c`,
        'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
        `background:${color} ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff`,
        'background:transparent');
}

export class AxiosMiddleWear {
    isActive = true;
    onRequest(config: AxiosManagerRequestConfig) {
        return config;
    }

    onRequestError(error: AxiosManagerError) {
        return error;
    }

    onResponse(response: AxiosManagerResponse) {
        return response;
    }

    onResponseError(error: AxiosManagerError) {
        return error;
    }

    log(message: string, color?: string) {
        log(this.constructor.name, message, color)
    }
}

class AxiosManager {
    private middleWear: AxiosMiddleWear[] = [];
    private ejectInterceptors_DefaultFunction: () => void = () => { log(this.constructor.name, "no more interceptor", "red") };
    private ejectInterceptorsFunction: () => void = this.ejectInterceptors_DefaultFunction;
    private QueryId : number=0;
    constructor(public axios: AxiosStatic = Axios) {
        log(this.constructor.name, "ready");
        this.registerInterceptor();
    }

    addMiddleWear(middleWear: AxiosMiddleWear) {
        log(this.constructor.name, "added : " + middleWear.constructor.name );
        this.middleWear.push(middleWear);
    }

    registerInterceptor() {
        let ejectRequestInterceptor = this.axios.interceptors.request.use((config) => this.$onRequest(config as any), (error) => this.$onRequestError(error));
        let ejectResponseInterceptor = this.axios.interceptors.response.use((response) => this.$onReponse(response as any), (error) => this.$onReponseError(error));
        this.ejectInterceptorsFunction = () => {
            this.axios.interceptors.request.eject(ejectRequestInterceptor);
            this.axios.interceptors.response.eject(ejectResponseInterceptor);
        }
    }

    unregisterInterceptor() {
        this.ejectInterceptorsFunction();
        this.ejectInterceptorsFunction = this.ejectInterceptors_DefaultFunction;
    }

    private $onRequest(config: AxiosManagerRequestConfig) {
        // Do something before request is sent
        config.id = this.QueryId++;
        this.middleWear.forEach((func) => config = func.onRequest(config) );
        return config;
    }

    private $onRequestError(error: AxiosManagerError) {
        // Do something with request error
        this.middleWear.forEach((func) => error = func.onRequestError(error))
        return Promise.reject(error);
    }

    private $onReponse(response: AxiosManagerResponse) {
        // Do something with response data
        this.middleWear.forEach((func) => response = func.onResponse(response))
        return response;
    }

    private $onReponseError(error: AxiosManagerError) {
        // Do something with response error
        this.middleWear.forEach((func) => error = func.onResponseError(error))
        return Promise.reject(error);
    }
}


export const AxiosManagerStatic = new AxiosManager(); 