import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class RegionOutput {
  @Field(() => String)
  Ref: string;

  @Field(() => String)
  AreasCenter: string;

  @Field(() => String)
  DescriptionRu: string;

  @Field(() => String)
  Description: string;
}

@ObjectType()
export class WarehouseOutput {
  @Field(() => String)
  Description: string;

  @Field(() => String)
  DescriptionRu: string;

  @Field(() => String)
  Ref: string;

  @Field(() => String)
  CityRef: string;
}

@ObjectType()
export class CitiesOutput {
  @Field(() => String)
  Description: string;

  @Field(() => String)
  DescriptionRu: string;

  @Field(() => String)
  Ref: string;

  @Field(() => String)
  Delivery1: string;

  @Field(() => String)
  Delivery2: string;

  @Field(() => String)
  Delivery3: string;

  @Field(() => String)
  Delivery4: string;

  @Field(() => String)
  Delivery5: string;

  @Field(() => String)
  Delivery6: string;

  @Field(() => String)
  Delivery7: string;

  @Field(() => String)
  Area: string;

  @Field(() => String)
  SettlementType: string;

  @Field(() => String)
  IsBranch: string;

  @Field(() => String)
  PreventEntryNewStreetsUser: string;

  @Field(() => String)
  CityID: string;

  @Field(() => String)
  SettlementTypeDescription: string;

  @Field(() => String)
  SettlementTypeDescriptionRu: string;

  @Field(() => Int)
  SpecialCashCheck: number;

  @Field(() => String)
  AreaDescription: string;

  @Field(() => String)
  AreaDescriptionRu: string;
}

export type RegionsResponse = {
  data: {
    data: RegionOutput[];
  };
};

export type CitiesResponse = {
  data: {
    data: CitiesOutput[];
  };
};

// @ObjectType()
// class Test {
//   @Field(() => Int)
//   userId: number;

//   @Field(() => Int)
//   id: number;

//   @Field(() => String)
//   title: string;

//   @Field(() => Boolean)
//   completed: boolean;
// }
