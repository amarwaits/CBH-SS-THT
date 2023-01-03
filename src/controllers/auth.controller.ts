import { v4 as uuidv4 } from 'uuid';
import { JsonController, Post, Body, UnauthorizedError, Res } from 'routing-controllers';
import { LoginRequest, LoginResponse } from '../models';
import { httpStatusCodes, password, TOKEN_PREFIX, username } from '../constants';
import { MyCache } from '../cache';

@JsonController('/user')
export class AuthController {
  @Post('/login')
  public async login(
    @Res() res: any,
    @Body() request: LoginRequest): Promise<LoginResponse | UnauthorizedError> {
    if (request.username === username && request.password === password) {
      const token = uuidv4()
      MyCache.set(`${TOKEN_PREFIX}${token}`, true, 3600)
      return new LoginResponse(true, token)
    } else {
      res.status(httpStatusCodes.UNAUTHORIZED)
      return new UnauthorizedError('Invalid username or password')
    }
  }
}