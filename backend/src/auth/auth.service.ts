import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(registerDto: RegisterDto) {
    // Verificar se o e-mail já está em uso
    const existingUser = await this.prisma.usuario.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Este e-mail já está cadastrado');
    }

    // Criar o usuário (senha em texto simples por enquanto — em produção usar bcrypt)
    const user = await this.prisma.usuario.create({
      data: {
        nome: registerDto.nome,
        email: registerDto.email,
        senha: registerDto.senha,
      },
      select: {
        id: true,
        nome: true,
        email: true,
      },
    });

    return { user, message: 'Cadastro realizado com sucesso' };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.usuario.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    // Comparação simples (em produção usar bcrypt.compare)
    if (user.senha !== loginDto.senha) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    return {
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
      },
      message: 'Login realizado com sucesso',
    };
  }
}
