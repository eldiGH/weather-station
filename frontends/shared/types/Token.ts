export interface TokensData {
	accessToken: { token: string; expires: Date };
	refreshTokenExpiry: Date;
}

export interface CookieTokensData {
	accessToken?: string;
	refreshTokenExpiry?: Date;
}
