import { Currency } from "./Currency";

export class MonetaryAmount {
  currency: Currency = Currency.USD;
  amount: number = 0;

  constructor(amount: number = 0, currency: Currency = Currency.USD) {
    this.amount = amount;
    this.currency = currency;
  }

  /** Does not support conversion yet, always assumes USD input and output */
  add(amount: MonetaryAmount) {
    return new MonetaryAmount(amount.amount + this.amount);
  }

  /** Does not support conversion yet, always assumes USD input and output */
  subtract(amount: MonetaryAmount) {
    return new MonetaryAmount(this.amount - amount.amount);
  }

  multiply(factor: number) {
    return new MonetaryAmount(this.amount * factor);
  }
}
