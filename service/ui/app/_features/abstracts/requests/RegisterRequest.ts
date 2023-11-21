import { IPhoto } from '@/_features/abstracts/models/IPhoto';

export interface IRegisterRequest {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  avatar?: File;
  photos: File[];
}

export interface IRegisterResponse {
  success: string;
  status?: number;
  errors?: { string: string[] };
}
