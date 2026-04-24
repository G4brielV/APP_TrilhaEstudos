import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConteudoDto } from './dto/create-conteudo.dto';
import { UpdateConteudoDto } from './dto/update-conteudo.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class ConteudosService {

  constructor(private prisma: PrismaService) {}

  // SEC: Impedir de mexer em trilhas de outros
  private async checkTrilhaOwnership(usuarioId: number, trilhaId: number) {
    const trilha = await this.prisma.trilha.findUnique({ where: { id: trilhaId } });
    if (!trilha) throw new NotFoundException('Trilha não encontrada');
    if (trilha.usuarioId !== usuarioId) {
      throw new ForbiddenException('Acesso negado a esta trilha');
    }
  }

  async create(usuarioId: number, createConteudoDto: CreateConteudoDto) {
    await this.checkTrilhaOwnership(usuarioId, createConteudoDto.trilhaId);
    return this.prisma.conteudo.create({
      data: createConteudoDto,
    });
  }

  async update(usuarioId: number, id: number, updateConteudoDto: UpdateConteudoDto) {
    const conteudo = await this.prisma.conteudo.findUnique({ 
      where: { id }, 
      include: { trilha: true } 
    });
    
    if (!conteudo) throw new NotFoundException('Conteúdo não encontrado');
    if (conteudo.trilha.usuarioId !== usuarioId) throw new ForbiddenException('Acesso negado');

    // Checando se o usuario está tentando mover para outra trilha que seja dele
    if (updateConteudoDto.trilhaId) {
      await this.checkTrilhaOwnership(usuarioId, updateConteudoDto.trilhaId);
    }

    return this.prisma.conteudo.update({
      where: { id },
      data: updateConteudoDto,
    });
  }

  async remove(usuarioId: number, id: number) {
    const conteudo = await this.prisma.conteudo.findUnique({ 
      where: { id }, 
      include: { trilha: true } 
    });
    
    if (!conteudo) throw new NotFoundException('Conteúdo não encontrado');
    if (conteudo.trilha.usuarioId !== usuarioId) throw new ForbiddenException('Acesso negado');

    return this.prisma.conteudo.delete({ where: { id } });
  }

  async updateStatus(usuarioId: number, id: number, updateStatusDto: UpdateStatusDto) {
    const conteudo = await this.prisma.conteudo.findUnique({ 
      where: { id }, 
      include: { trilha: true } 
    });
    
    if (!conteudo) throw new NotFoundException('Conteúdo não encontrado');
    if (conteudo.trilha.usuarioId !== usuarioId) {
      throw new ForbiddenException('Acesso negado');
    }
    return this.prisma.conteudo.update({
      where: { id },
      data: { isCompleted: updateStatusDto.isCompleted },
    });
  }
}
