import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../users/user.entity';

/**
 * Pobiera użytkownika z requesta (req.user) ustawionego przez JwtStrategy.
 * Możesz użyć @GetUser() aby pobrać cały obiekt użytkownika
 * albo @GetUser('email') aby pobrać konkretną właściwość.
 */
export const GetUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as User;
    return data ? user?.[data] : user;
  },
);
