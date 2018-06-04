
import { AxiosMiddleWear, AxiosManagerRequestConfig, AxiosManagerResponse, AxiosManagerError } from "./AxiosManager";
import axios, { CancelToken, CancelTokenStatic, CancelTokenSource } from 'axios';

export class AxiosManagerHttpErrorCode extends AxiosMiddleWear {
    private codeToFunc: { [httpCode: number]: ((error: AxiosManagerError) => void) } = {}
    constructor() {
        super();
    }

    addManager(httpcode: number, func: (error: AxiosManagerError) => void) {
        this.codeToFunc[httpcode] = func;
    }

    removeManager(httpCode: number) {
        delete this.codeToFunc[httpCode];
    }

    onResponseError(error: AxiosManagerError) {
        let response = error.response;
        if (response) {
            let func = this.codeToFunc[response.status];
            if (func) {
                this.log("Execution for error " + response.status, "red");
                func(error);
            }
            else { }
        }
        return error;
    }
}