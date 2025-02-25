import { User } from "./user.interface";

export interface Produto {
  nome: string,
  tipo: string,
  marca: string,
  dataCadastro: Date,
  dataUltimaEdicao: Date,
  usuarioEditou: User,
  descricao?: string
}