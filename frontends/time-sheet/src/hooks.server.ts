import { handleFactory } from '@shared/ui/helpers';

const NOT_AUTHED_ROUTES = ['/login', '/register'];

const isOnPermittedForAuthedRoute = (pathname: string) =>
	NOT_AUTHED_ROUTES.some((route) => pathname.startsWith(route));
const isOnAuthedRoute = (pathname: string) => !isOnPermittedForAuthedRoute(pathname);

export const handle = handleFactory({
	isOnAuthedRoute,
	isOnPermittedForAuthedRoute
});
