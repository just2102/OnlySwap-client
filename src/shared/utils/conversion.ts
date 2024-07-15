import Decimal from "decimal.js";

export function d(value: Decimal.Value) {
  return new Decimal(value);
}
