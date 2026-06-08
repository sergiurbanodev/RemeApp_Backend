import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusMap: Record<string, number> = {
      P2002: HttpStatus.CONFLICT,
      P2025: HttpStatus.NOT_FOUND,
      P2003: HttpStatus.BAD_REQUEST,
    };

    const status =
      statusMap[exception.code] ?? HttpStatus.INTERNAL_SERVER_ERROR;

    const message: Record<string, string> = {
      P2002: 'Ya existe un registro con esos datos',
      P2025: 'Registro no encontrado',
      P2003: 'Referencia inválida',
    };

    response.status(status).json({
      statusCode: status,
      error: exception.code,
      message: message[exception.code] ?? 'Error de base de datos',
    });
  }
}
