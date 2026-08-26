export type PasswordResetCode = {
    id: number;
    user_id: number;
    code: string;
    created_at?: string;
}
