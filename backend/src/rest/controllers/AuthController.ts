import {
  HttpStatus,
  loginRequestSchema,
  logoutRequestSchema,
  refreshRequestSchema,
  registerRequestSchema
} from 'shared';
import { controller, endpointFactory } from '../../helpers';
import { AuthService } from '../../services';

export const AuthController = controller('/auth');
const endpoint = endpointFactory(AuthController);

endpoint(
  {
    name: 'register',
    path: '/register',
    method: 'post',
    bodyValidationSchema: registerRequestSchema
  },
  async (req, res) => {
    const tokens = await AuthService.register(req.body);

    res.status(HttpStatus.CREATED).send(tokens);
  }
);

endpoint(
  {
    name: 'login',
    path: '/login',
    method: 'post',
    bodyValidationSchema: loginRequestSchema
  },
  async (req, res) => {
    const response = await AuthService.login(req.body);

    res.send(response);
  }
);

endpoint(
  {
    name: 'refresh',
    path: '/refresh',
    method: 'post',
    bodyValidationSchema: refreshRequestSchema
  },
  async (req, res) => {
    const tokens = await AuthService.refresh(req.body.refreshToken);

    res.send(tokens);
  }
);

endpoint(
  {
    name: 'logout',
    path: '/logout',
    method: 'post',
    bodyValidationSchema: logoutRequestSchema
  },
  async (req, res) => {
    await AuthService.logout(req.body.refreshToken);

    res.sendStatus(HttpStatus.NO_CONTENT);
  }
);
