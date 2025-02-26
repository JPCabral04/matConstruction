import { IProduto } from "./product.interface";
import { IUser } from "./user.interface";

export interface IStock {
  produto: IProduto,
  lote: number,
  quantidade: number,
  dataValidade?: Date,
  dataCadastro: Date,
  dataUltimaEdicao: Date,
  usuarioEditou: IUser
}