import { IUser } from "./user.interface";

export interface IProduct {
  nome: string,
  tipo: string,
  marca: string,
  dataCadastro: string,
  dataUltimaEdicao: string,
  usuarioEditou: IUser,
  descricao?: string,
  imagemUrl?: string,
  id?: string
}