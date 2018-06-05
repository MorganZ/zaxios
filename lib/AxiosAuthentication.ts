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

export class AxiosAuthentification extends AxiosMiddleWear {
  constructor(
    public actionOnUnauthorized: (error: AxiosError) => void = () => {
      console.log("no function actionOnUnauthorized");
    }
  ) {
    super();
  }
  public onResponseError(error: AxiosManagerError) {
    if (error.response && error.response.status === 401) {
      this.log("Error : " + error.config.url, "red");
      this.actionOnUnauthorized(error);
    }
    return error;
  }
}
