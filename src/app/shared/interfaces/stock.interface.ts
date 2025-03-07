import { IUser } from "./user.interface";

export interface IStock {
  idProduto: string,
  lote: number,
  quantidade: number,
  dataValidade?: string,
  dataCadastro: Date,
  dataUltimaEdicao: Date,
  usuarioEditou: IUser,
  id?: string
}