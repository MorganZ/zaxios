import { AxiosMiddleWear, AxiosManagerRequestConfig, AxiosManagerResponse, AxiosManagerError } from "./AxiosManager";

export class AxiosQueryInfo extends AxiosMiddleWear {
    queryInfo: { [id: number]: any } = {};
    meta: any;
    func: (metadata: {}) => void = () => { throw 'no update function'; };

    constructor(func: (metadata: any) => void, log: boolean = false) {
        super();
        this.func = func;
    }

    onRequest(config: AxiosManagerRequestConfig) {
        if (config.meta) {
            this.queryInfo[config.id] = config.meta;
            this.computeMeta();
        }
        return config;
    }

    onRequestError(error: AxiosManagerError) {
        this.deleteQueryMeta(error.config.id);
        return error;
    }

    onResponse(response: AxiosManagerResponse) {
        this.deleteQueryMeta(response.config.id);
        return response;
    }

    onResponseError(error: AxiosManagerError) {
        this.deleteQueryMeta(error.config.id);
        return error
    }

    private deleteQueryMeta(id: number) {
        if (this.queryInfo[id]) {
            delete this.queryInfo[id];
            this.computeMeta();
        }
    }

    private computeMeta() {
        this.meta = {};
        for (let id in this.queryInfo) {
            Object.assign(this.meta, this.queryInfo[id]);
        }
        this.func(this.meta);
    }
}

