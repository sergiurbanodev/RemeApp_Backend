import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppConfigModule } from './config/config.module.js';
import { PrismaModule } from './database/prisma.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { AppService } from './app.service.js';

@Module({
  imports: [AppConfigModule, PrismaModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
