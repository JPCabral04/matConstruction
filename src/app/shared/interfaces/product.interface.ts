import { IUser } from "./user.interface";

export interface IProduto {
  nome: string,
  tipo: string,
  marca: string,
  dataCadastro: Date,
  dataUltimaEdicao: Date,
  usuarioEditou: IUser,
  descricao?: string
}