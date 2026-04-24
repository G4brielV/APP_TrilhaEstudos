import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Verificar se o e-mail já está em uso
    const existingUser = await this.prisma.usuario.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Este e-mail já está cadastrado');
    }

    // Hash da senha com bcrypt
    const hashedPassword = await bcrypt.hash(registerDto.senha, this.SALT_ROUNDS);

    const user = await this.prisma.usuario.create({
      data: {
        nome: registerDto.nome,
        email: registerDto.email,
        senha: hashedPassword,
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

    // Comparar senha com bcrypt
    const isPasswordValid = await bcrypt.compare(loginDto.senha, user.senha);
    if (!isPasswordValid) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    // Gerar JWT
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
      },
      accessToken,
      message: 'Login realizado com sucesso',
    };
  }
}
