import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/users/role.enum';

export interface JwtPayload {
  sub: number;
  email: string;
  role: Role;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

