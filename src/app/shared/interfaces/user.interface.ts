import { UserType } from "../enums/userType.enum";

export interface IUser {
  codigo: string,
  nome: string,
  email: string,
  imagemUrl?: string,
  tipoUsuario: UserType,
  id?: string
}