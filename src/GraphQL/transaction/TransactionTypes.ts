import { ObjectType, Field, Int } from '@nestjs/graphql';
import { TransactionEntity } from '@root/database/entities';

@ObjectType()
export class TransactionsOutput {
  @Field(() => Int)
  total: number;

  @Field(() => [TransactionEntity])
  transactions: TransactionEntity[];
}

export enum Currency {
  UAH = 'UAH',
}

export enum FormLanguage {
  uk = 'uk',
  ru = 'ru',
}

export enum LiqPayCommand {
  callback = 'liqpay.callback',
  ready = 'liqpay.ready',
  close = 'liqpay.close',
}

export type TransactionStatus = 'success' | 'error';

export type TransactionParams = {
  order_id: string;
  price: number;
};

export type LiqPayApiParams = {
  action: string;
  public_key?: string;
  version?: NumberString;
  amount?: number;
  currency?: Currency;
  description?: string;
  order_id?: number | string;
};

export type Transaction = {
  acq_id: number;
  action: string;
  agent_commission: number;
  amount: number;
  amount_bonus: number;
  amount_credit: number;
  amount_debit: number;
  card_mask: string;
  cmd: LiqPayCommand;
  commission_credit: number;
  commission_debit: number;
  create_date: number;
  currency: Currency;
  currency_credit: Currency;
  currency_debit: Currency;
  data: string;
  description: string;
  end_date: number;
  ip: string;
  is_3ds: false;
  language: FormLanguage;
  liqpay_order_id: string;
  mpi_eci: string;
  notify: {
    data: string;
    signature: string;
  };
  order_id: string;
  payment_id: number;
  paytype: string;
  public_key: string;
  receiver_commission: number;
  result: string;
  sender_bonus: number;
  sender_card_bank: string;
  sender_card_country: number;
  sender_card_mask2: string;
  sender_card_type: string;
  sender_commission: number;
  sender_first_name: string;
  sender_last_name: string;
  show_moment_part: boolean;
  signature: string;
  status: TransactionStatus;
  transaction_id: number;
  type: string;
  user: {
    country_code: StringNull;
    id: StringNull;
    nick: StringNull;
    phone: StringNull;
  };
  version: number;
};

// ? Этот тип указывает, что значение является числом, приведённым в строку. Пример: "123"
type NumberString = string;

type StringNull = string | null;
