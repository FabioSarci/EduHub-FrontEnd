export interface IUser {
    id?: number;
    name: string;
    surname: string;
    birthdate?: string;
    role?: UserTypes;
}

export interface IUserCredential{
    id?: number;
    email?:string;
    password?: string;
}

export enum UserTypes{
    STUDENT,
    TEACHER,
    ADMIN
}

