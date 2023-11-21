import { IPhoto } from './IPhoto';

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  avatar: string;
  photos: IPhoto[];
}
