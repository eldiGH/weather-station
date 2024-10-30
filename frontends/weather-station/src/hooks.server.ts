import { handleFactory } from '@shared/ui/helpers';

const NOT_AUTHED_ROUTES = ['/login', '/register', '/kiosk'];
const AUTHED_NOT_ALLOWED_ROUTES = ['/login', '/register'];

const isOnAuthedRoute = (pathname: string) =>
	!NOT_AUTHED_ROUTES.some((notAuthedRoute) => pathname.startsWith(notAuthedRoute));

const isOnPermittedForAuthedRoute = (pathname: string) =>
	AUTHED_NOT_ALLOWED_ROUTES.some((authedNotAllowedRoute) =>
		pathname.startsWith(authedNotAllowedRoute)
	);

export const handle = handleFactory({ isOnAuthedRoute, isOnPermittedForAuthedRoute });
