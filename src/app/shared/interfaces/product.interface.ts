import { IUser } from "./user.interface";

export interface IProduct {
  nome: string,
  tipo: string,
  marca: string,
  dataCadastro: Date,
  dataUltimaEdicao: Date,
  usuarioEditou: IUser,
  descricao?: string,
  imagemUrl?: string
}