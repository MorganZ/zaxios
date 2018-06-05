
import { AxiosMiddleWear, AxiosManagerRequestConfig, AxiosManagerResponse, AxiosManagerError } from "./AxiosManager";
import axios, { CancelToken, CancelTokenStatic, CancelTokenSource } from 'axios';

export class AxiosManagerHttpErrorCode extends AxiosMiddleWear {
    private codeToFunc: { [httpCode: number]: ((error: AxiosManagerError) => void) } = {};
    constructor() {
        super();
    }

    public addManager(httpcode: number, func: (error: AxiosManagerError) => void) {
        this.codeToFunc[httpcode] = func;
    }

    public removeManager(httpCode: number) {
        delete this.codeToFunc[httpCode];
    }

    public onResponseError(error: AxiosManagerError) {
        const response = error.response;
        if (response) {
            const func = this.codeToFunc[response.status];
            if (func) {
                this.log("Execution for error " + response.status, "red");
                func(error);
            }
        }
        return error;
    }
}
