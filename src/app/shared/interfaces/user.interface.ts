import { UserType } from "../enums/userType.enum";

export interface User {
  email: string,
  type: UserType
}