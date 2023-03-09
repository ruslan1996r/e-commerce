import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import * as fs from 'fs/promises';
import * as path from 'path';

import { CitiesResponse, RegionsResponse } from './DeliveryTypes';
import { Config } from '@root/config';

@Injectable()
export class DeliveryService {
  private readonly logger: Logger = new Logger(DeliveryService.name);
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  private promisify(observer: Observable<any>): Promise<AxiosResponse<any>> {
    return new Promise((res, rej) => {
      observer.subscribe({
        next: (data) => res(data),
        error: (err) => rej(err),
      });
    });
  }

  async getRegions() {
    const key = this.configService.get(Config.NOVA_POSHTA_KEY);

    const body = {
      apiKey: key,
      modelName: 'Address',
      calledMethod: 'getAreas',
      methodProperties: {},
    };

    const regionsSchema = path.join(__dirname, '../../../schemas/regions.json');

    const regions = await fs.readFile(regionsSchema, 'utf-8');

    if (regions) {
      this.logger.log('Regions from Local');
      return JSON.parse(regions).data;
    }

    const { data }: RegionsResponse = await this.promisify(
      this.httpService.post('/', body),
    );

    await fs.appendFile(regionsSchema, JSON.stringify(data));
    this.logger.log('Regions from API');
    return data.data;
  }

  async getCities() {
    const t1 = new Date().getTime();
    const key = this.configService.get(Config.NOVA_POSHTA_KEY);

    const body = {
      modelName: 'Address',
      calledMethod: 'getCities',
      methodProperties: {
        Language: 'ru',
        Warehouse: 1,
      },
      apiKey: key,
    };

    const citiesSchema = path.join(__dirname, '../../../schemas/cities.json');
    const cities = await fs.readFile(citiesSchema, 'utf-8');

    if (cities) {
      const citiesData = JSON.parse(cities).data;
      const t2 = new Date().getTime();

      this.logger.log(`${citiesData.length} Cities from local (${t2 - t1} ms)`);

      return citiesData;
    }

    const { data }: CitiesResponse = await this.promisify(
      this.httpService.post('/', body),
    );

    const purifiedData = {
      ...data,
      data: data.data.map((city) => {
        return {
          Ref: city.Ref,
          Area: city.Area,
          Description: city.Description,
          DescriptionRu: city.DescriptionRu,
        };
      }),
    };

    await fs.appendFile(citiesSchema, JSON.stringify(purifiedData));

    const t3 = new Date().getTime();
    this.logger.log(
      `${purifiedData.data.length} Cities from API (${t3 - t1} ms)`,
    );

    return purifiedData.data;
  }

  async citiesByArea(areaRef: string) {
    const t1 = new Date().getTime();
    const key = this.configService.get(Config.NOVA_POSHTA_KEY);

    const body = {
      modelName: 'Address',
      calledMethod: 'getCities',
      methodProperties: {
        Language: 'ru',
        Warehouse: 1,
      },
      apiKey: key,
    };

    const citiesSchema = path.join(__dirname, '../../../schemas/cities.json');
    const cities = await fs.readFile(citiesSchema, 'utf-8');

    if (cities) {
      const citiesData = JSON.parse(cities).data.filter(
        (city: { Area: string }) => city.Area === areaRef,
      );
      const t2 = new Date().getTime();
      this.logger.log(
        `${citiesData.length} Cities by area from Local (${t2 - t1} ms)`,
      );
      return citiesData;
    }

    const { data }: CitiesResponse = await this.promisify(
      this.httpService.post('/', body),
    );

    await fs.appendFile(citiesSchema, JSON.stringify(data));

    const citiesByArea = data.data.filter(
      (city: { Area: string }) => city.Area === areaRef,
    );
    const t3 = new Date().getTime();
    this.logger.log(
      `${citiesByArea.length} Cities by area from API (${t3 - t1} ms)`,
    );
    return citiesByArea;
  }

  async getWarehouses(cityRef: string) {
    const key = this.configService.get(Config.NOVA_POSHTA_KEY);
    const body = {
      modelName: 'AddressGeneral',
      calledMethod: 'getWarehouses',
      methodProperties: {
        CityRef: cityRef,
      },
      apiKey: key,
    };
    const { data } = await this.promisify(this.httpService.post('/', body));

    return data.data;
  }
}
