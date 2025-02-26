import { IStock } from "./stock.interface";
import { IUser } from "./user.interface";

export interface IStockRelease {
  estoque: IStock,
  quantidade: number,
  data: Date,
  usuario: IUser
}