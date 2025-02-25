import { Produto } from "./product.interface";
import { User } from "./user.interface";

export interface Stock {
  produto: Produto,
  lote: number,
  quantidade: number,
  dataValidade?: Date,
  dataCadastro: Date,
  dataUltimaEdicao: Date,
  usuarioEditou: User
}