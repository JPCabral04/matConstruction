import { Produto } from "./product.interface";
import { User } from "./user.interface";

export interface Stock {
  product: Produto,
  lot: number,
  quantity: number,
  valityDate?: Date,
  registryDate: Date,
  lastEditDate: Date,
  editingUser: User
}