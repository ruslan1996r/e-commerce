import axios, { Axios, AxiosRequestConfig } from 'axios';
import crypto from 'crypto';

import { LiqPayApiParams } from './TransactionTypes';

export class LiqPayService {
  private publicKey: string;
  private privateKey: string;
  private liqApi: Axios;

  constructor(publicKey: string, privateKey: string) {
    this.publicKey = publicKey;
    this.privateKey = privateKey;
    this.liqApi = axios.create({
      baseURL: 'https://www.liqpay.ua/api/',
      headers: {
        'Content-Type': 'text/plain',
      },
    }) as AxiosRequestConfig as any;
  }

  liqPayApi = async (path: string, params: LiqPayApiParams) => {
    if (!params.version) {
      throw new Error('version is null');
    }

    const jsonBody = JSON.stringify({ ...params, public_key: this.publicKey });
    const data = Buffer.from(jsonBody).toString('base64');
    const signature = this.strToSign(this.privateKey + data + this.privateKey);

    const body =
      path === 'request'
        ? new URLSearchParams({ data, signature })
        : { data, signature };

    const res = await this.liqApi.post(path, body);

    return res.data;
  };

  liqForm = async (params: any) => {
    const jsonBody = JSON.stringify(this.buildParams(params));
    const data = Buffer.from(jsonBody).toString('base64');
    const signature = this.strToSign(this.privateKey + data + this.privateKey);
    return { data, signature };
  };

  buildSignature = (params: any) => {
    const jsonBody = JSON.stringify(this.buildParams(params));
    const data = Buffer.from(jsonBody).toString('base64');

    return this.strToSign(this.privateKey + data + this.privateKey);
  };

  buildParams = (params: LiqPayApiParams) => {
    if (!params.version) {
      throw new Error('version is null');
    }
    if (!params.amount) {
      throw new Error('amount is null');
    }
    if (!params.currency) {
      throw new Error('currency is null');
    }
    if (!params.description) {
      throw new Error('description is null');
    }

    return {
      ...params,
      public_key: this.publicKey,
    };
  };

  strToSign = (str: crypto.BinaryLike) => {
    const sha1 = crypto.createHash('sha1');
    sha1.update(str);
    return sha1.digest('base64');
  };
}
