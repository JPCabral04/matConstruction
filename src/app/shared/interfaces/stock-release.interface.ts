import { Stock } from "./stock.interface";
import { User } from "./user.interface";

export interface StockRelease {
  stock: Stock,
  quantity: number,
  date: Date,
  user: User
}