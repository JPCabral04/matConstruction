import { IProduct } from "./product.interface";
import { IUser } from "./user.interface";

export interface IStock {
  produto: IProduct,
  lote: number,
  quantidade: number,
  dataValidade?: Date,
  dataCadastro: Date,
  dataUltimaEdicao: Date,
  usuarioEditou: IUser,
  id?: string
}