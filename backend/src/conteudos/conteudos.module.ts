import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { Module } from '@nestjs/common';
import { ConteudosService } from './conteudos.service';
import { ConteudosController } from './conteudos.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [JwtModule.register({
        secret: 'sua_chave_secreta', // Use variáveis de ambiente na vida real!
        signOptions: { expiresIn: '60s' },
      }),
      PrismaModule],
  controllers: [ConteudosController],
  providers: [ConteudosService],
})
export class ConteudosModule {}
