import { BaseResponseIface } from '@/interfaces/response';

import BaseService from './base';

class UploadService extends BaseService {
  public async uploadFile(file: Blob): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data: response } = await this.post<BaseResponseIface<string>>(
        "/cdn/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

const uploadService = new UploadService();
export default uploadService;