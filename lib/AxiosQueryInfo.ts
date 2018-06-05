import {
  AxiosMiddleWear,
  AxiosManagerRequestConfig,
  AxiosManagerResponse,
  AxiosManagerError
} from "./AxiosManager";

export class AxiosQueryInfo extends AxiosMiddleWear {
  public queryInfo: { [id: number]: any } = {};
  public meta: any;
  constructor(func: (metadata: any) => void, log: boolean = false) {
    super();
    this.func = func;
  }

  public func: (metadata: {}) => void = () => {
    throw new Error("no update function");
  }

  public onRequest(config: AxiosManagerRequestConfig) {
    if (config.meta) {
      this.queryInfo[config.id] = config.meta;
      this.computeMeta();
    }
    return config;
  }

  public onRequestError(error: AxiosManagerError) {
    this.deleteQueryMeta(error.config.id);
    return error;
  }

  public onResponse(response: AxiosManagerResponse) {
    this.deleteQueryMeta(response.config.id);
    return response;
  }

  public onResponseError(error: AxiosManagerError) {
    this.deleteQueryMeta(error.config.id);
    return error;
  }

  private deleteQueryMeta(id: number) {
    if (this.queryInfo[id]) {
      delete this.queryInfo[id];
      this.computeMeta();
    }
  }

  private computeMeta() {
    this.meta = {};
    for (const id in this.queryInfo) {
      if (id) {
        Object.assign(this.meta, this.queryInfo[id]);
      }
    }
    this.func(this.meta);
  }
}
