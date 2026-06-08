import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

export const CurrentUser: any = createParamDecorator(
  (__: unknown, ctx: ExecutionContext): User | null => {
    const request = ctx.switchToHttp().getRequest<Request & { user?: User }>();
    return request.user ?? null;
  },
);
