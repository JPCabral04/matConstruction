import { Stock } from "./stock.interface";
import { User } from "./user.interface";

export interface StockRelease {
  estoque: Stock,
  quantidade: number,
  data: Date,
  usuario: User
}