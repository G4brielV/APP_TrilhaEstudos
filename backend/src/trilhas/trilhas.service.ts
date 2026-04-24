import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrilhaDto } from './dto/create-trilha.dto';
import { UpdateTrilhaDto } from './dto/update-trilha.dto';

@Injectable()
export class TrilhasService {

  constructor(private prisma: PrismaService) {}

  async create(usuarioId: number,createTrilhaDto: CreateTrilhaDto) {
    return this.prisma.trilha.create({
      data: {
        ...createTrilhaDto,
        usuarioId: usuarioId,
      },
    });
  }

  async findAll(usuarioId: number, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.trilha.findMany({
        where: { usuarioId: usuarioId },
        skip,
        take: limit,
        include: { _count: { select: { conteudos: true } } },
      }),
      this.prisma.trilha.count({ where: { usuarioId: usuarioId } }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(usuarioId: number,id: number) {
    const trilha = await this.prisma.trilha.findFirst({
      where: { id, usuarioId: usuarioId },
      include: { conteudos: true }, 
    });

    if (!trilha) throw new NotFoundException('Trilha não encontrada');
    return trilha;
  }

  async update(usuarioId: number,id: number, updateTrilhaDto: UpdateTrilhaDto) {
    await this.findOne(usuarioId, id); 
    return this.prisma.trilha.update({
      where: { id },
      data: updateTrilhaDto,
    });
  }

  async remove(usuarioId: number,id: number) {
    await this.findOne(usuarioId, id);
    return this.prisma.trilha.delete({ where: { id } });
  }
}
