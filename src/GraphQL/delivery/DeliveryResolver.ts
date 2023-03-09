import { Args, Resolver } from '@nestjs/graphql';
import { Query } from '@nestjs/graphql';
import { DeliveryService } from './DeliveryService';
import { CitiesOutput, RegionOutput, WarehouseOutput } from './DeliveryTypes';

@Resolver()
export class DeliveryResolver {
  constructor(private deliveryService: DeliveryService) {}

  @Query(() => [RegionOutput])
  async regions(): Promise<RegionOutput[]> {
    return this.deliveryService.getRegions();
  }

  @Query(() => [CitiesOutput])
  async cities(): Promise<CitiesOutput[]> {
    return this.deliveryService.getCities();
  }

  /**
   * @param cityRef city.Ref
   */
  @Query(() => [WarehouseOutput])
  async warehousesByCity(
    @Args({ name: 'cityRef', type: () => String }) cityRef: string,
  ): Promise<WarehouseOutput[]> {
    return this.deliveryService.getWarehouses(cityRef);
  }

  @Query(() => [CitiesOutput])
  async citiesByArea(
    @Args({ name: 'areaRef', type: () => String }) areaRef: string,
  ): Promise<CitiesOutput[]> {
    return this.deliveryService.citiesByArea(areaRef);
  }
}
