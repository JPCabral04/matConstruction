import { UserType } from "../enums/userType.enum";

export interface User {
  nome: string,
  email: string,
  tipoUsuario: UserType
}