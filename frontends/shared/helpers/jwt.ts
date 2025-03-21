import type { Jwt } from '../types/Jwt';
import { fromUnixTime, isBefore } from 'date-fns';
import { jwtDecode } from 'jwt-decode';

export interface IsValidOptions {
	// When validating advanceTime is subtracted from exp date defaults to 0
	advanceTime?: number;
}

const decode = (token: string) => jwtDecode(token) as Jwt;

const isValid = (token: string, options?: IsValidOptions): Jwt | undefined => {
	try {
		const decodedToken = decode(token);

		if (isBefore(new Date(), fromUnixTime(decodedToken.exp - (options?.advanceTime ?? 0)))) {
			return decodedToken;
		}
	} catch (error) {
		console.error(error);
	}
};

export const jwt = { decode, isValid };
