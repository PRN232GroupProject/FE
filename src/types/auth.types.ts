export interface ILoginResponse {
    token: string;
    role: string | number;
}

export interface IRegisterRequest {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ILoginRequest {
    email: string;
    password: string;
}