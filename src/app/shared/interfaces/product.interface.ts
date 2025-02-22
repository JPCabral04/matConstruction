import { User } from "./user.interface";

export interface Produto {
  name: string,
  type: string,
  brand: string,
  registryDate: Date,
  lastEditDate: Date,
  editingUser: User,
  description?: string
}