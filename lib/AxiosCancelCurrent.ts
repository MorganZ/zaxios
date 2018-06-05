import {
  AxiosMiddleWear,
  AxiosManagerRequestConfig,
  AxiosManagerResponse,
  AxiosManagerError
} from "./AxiosManager";
import axios, {
  CancelToken,
  CancelTokenStatic,
  AxiosStatic,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  CancelTokenSource
} from "axios";

export class AxiosCancelCurrent extends AxiosMiddleWear {
  public configs: { [url: string]: boolean } = {};
  public i = 0;

  constructor() {
    super();
  }

  public onRequest(config: AxiosManagerRequestConfig) {
    (config as any).id = this.i++;
    if (config.url && this.configs[config.url]) {
      const cancelToken = axios.CancelToken;
      const source = cancelToken.source();
      config.cancelToken = source.token;
      source.cancel("Operation canceled by the user.");
      this.log("cancel " + this.i + ": " + config.url, "red");
    }

    if (config.url) {
      this.configs[config.url] = true;
    }

    return config;
  }
  public onResponse(response: AxiosManagerResponse) {
    this.$removeConfigOnResponse(response.config);
    return response;
  }
  public onResponseError(error: AxiosManagerError) {
    const canceled = axios.isCancel(error);
    if (!canceled) {
      this.$removeConfigOnResponse(error.config);
    }
    return error;
  }

  public $removeConfigOnResponse(config: AxiosRequestConfig) {
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
