import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { TrilhasService } from './trilhas.service';
import { TrilhasController } from './trilhas.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    JwtModule.register({
      secret: 'sua_chave_secreta', // Use variáveis de ambiente na vida real!
      signOptions: { expiresIn: '60s' },
    }),
    PrismaModule],
  controllers: [TrilhasController],
  providers: [TrilhasService],
})
export class TrilhasModule {}
