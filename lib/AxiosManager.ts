import Axios, {
  CancelToken,
  CancelTokenStatic,
  AxiosStatic,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError
} from "axios";

export interface AxiosManagerRequestConfig extends AxiosRequestConfig {
  id: number;
  meta: any;
}
export interface AxiosManagerResponse extends AxiosResponse {
  config: AxiosManagerRequestConfig;
}
export interface AxiosManagerError extends AxiosError {
  config: AxiosManagerRequestConfig;
}

const log = (sender: string, message: string, color: string = "#41b883") => {
  if (typeof window === "undefined") {
    console.log(
      `%c ${sender} %c ${message} %c`,
      "background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff",
      `background:${color} ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff`,
      "background:transparent"
    );
  } else {
    console.log(sender + " : " + message);
  }
};

export class AxiosMiddleWear {
  public isActive = true;
  public onRequest(config: AxiosManagerRequestConfig) {
    return config;
  }

  public onRequestError(error: AxiosManagerError) {
    return error;
  }

  public onResponse(response: AxiosManagerResponse) {
    return response;
  }

  public onResponseError(error: AxiosManagerError) {
    return error;
  }

  public log(message: string, color?: string) {
    log(this.constructor.name, message, color);
  }
}

class AxiosManager {
  private QueryId: number = 0;
  private middleWear: AxiosMiddleWear[] = [];

  constructor(public axios: AxiosStatic = Axios) {
    log(this.constructor.name, "ready");
    this.ejectInterceptorsDefaultFunction = this.ejectInterceptorsFunction;
    this.registerInterceptor();
  }

  public addMiddleWear(middleWear: AxiosMiddleWear) {
    log(this.constructor.name, "added : " + middleWear.constructor.name);
    this.middleWear.push(middleWear);
  }

  public registerInterceptor() {
    const ejectRequestInterceptor = this.axios.interceptors.request.use(
      config => this.$onRequest(config as any),
      error => this.$onRequestError(error)
    );
    const ejectResponseInterceptor = this.axios.interceptors.response.use(
      response => this.$onReponse(response as any),
      error => this.$onReponseError(error)
    );
    this.ejectInterceptorsFunction = () => {
      this.axios.interceptors.request.eject(ejectRequestInterceptor);
      this.axios.interceptors.response.eject(ejectResponseInterceptor);
    };
  }

  public unregisterInterceptor() {
    this.ejectInterceptorsFunction();
    this.ejectInterceptorsFunction = this.ejectInterceptorsDefaultFunction;
  }

  private ejectInterceptorsDefaultFunction: () => void = () => {
    log(this.constructor.name, "no more interceptor", "red");
  }

  private ejectInterceptorsFunction: () => void = this
    .ejectInterceptorsDefaultFunction;

  private $onRequest(config: AxiosManagerRequestConfig) {
    // Do something before request is sent
    config.id = this.QueryId++;
    this.middleWear.forEach(func => (config = func.onRequest(config)));
    return config;
  }

  private $onRequestError(error: AxiosManagerError) {
    // Do something with request error
    this.middleWear.forEach(func => (error = func.onRequestError(error)));
    return Promise.reject(error);
  }

  private $onReponse(response: AxiosManagerResponse) {
    // Do something with response data
    this.middleWear.forEach(func => (response = func.onResponse(response)));
    return response;
  }

  private $onReponseError(error: AxiosManagerError) {
    // Do something with response error
    this.middleWear.forEach(func => (error = func.onResponseError(error)));
    return Promise.reject(error);
  }
}

export const AxiosManagerStatic = new AxiosManager();
