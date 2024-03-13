import { Axios, AxiosRequestConfig, AxiosResponse } from 'axios';

import { getSession } from '@/actions/server.actions';
import { ServiceAPI } from '@/interfaces/service.iface';

import { axiosInstance } from './axiosInstance';

class BaseService implements ServiceAPI {
    protected common: Axios

    constructor() {
        this.common = axiosInstance;
    }

    public request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.common.request(config)
    }

    private async headers() {
        const token = await getSession()
        return {
            "Authorization": `Bearer ${token}`
        }
    }

    public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.common.get<T>(url, {
            ...config,
            headers: {
                ...await this.headers(),
                ...config?.headers,
            },
        })
    }

    public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.common.delete<T>(url, {
            ...config,
            headers: {
                ...await this.headers(),
                ...config?.headers,
            },
        })
    }

    public async head<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.common.head<T>(url, {
            ...config,
            headers: {
                ...await this.headers(),
                ...config?.headers,
            },
        })
    }

    public async options<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.common.options<T>(url, {
            ...config,
            headers: {
                ...await this.headers(),
                ...config?.headers,
            },
        })
    }

    public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.common.post<T>(url, data, {
            ...config,
            headers: {
                ...await this.headers(),
                ...config?.headers,
            },
        })
    }

    public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.common.put<T>(url, data, {
            ...config,
            headers: {
                ...await this.headers(),
                ...config?.headers,
            },
        })
    }

    public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.common.patch<T>(url, data, {
            ...config,
            headers: {
                ...await this.headers(),
                ...config?.headers,
            },
        })
    }
}


export default BaseService;