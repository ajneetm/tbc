export interface LoginApiResponse {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    refresh_token: string;
    access_token: string;
}

export interface RefreshToken {
message: string;
refresh_token: string;
access_token: string;
refresh_expires_at: string;
access_expires_at: string;
}