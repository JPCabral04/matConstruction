import { IUser } from "./user.interface";

export interface IStock {
  idProduto: string,
  lote: number,
  quantidade: number,
  dataValidade?: Date,
  dataCadastro: Date,
  dataUltimaEdicao: Date,
  usuarioEditou: IUser,
  id?: string
}