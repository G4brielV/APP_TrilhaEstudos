import { Controller, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { ConteudosService } from './conteudos.service';
import { CreateConteudoDto } from './dto/create-conteudo.dto';
import { UpdateConteudoDto } from './dto/update-conteudo.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('conteudos')
@UseGuards(JwtAuthGuard)
export class ConteudosController {
  constructor(private readonly conteudosService: ConteudosService) {}

  @Post()
  create(@Req() req: any, @Body() createConteudoDto: CreateConteudoDto) {
    return this.conteudosService.create(req.user.userId, createConteudoDto);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() updateConteudoDto: UpdateConteudoDto) {
    return this.conteudosService.update(req.user.userId, id, updateConteudoDto);;
  }

  @Patch(':id/toggle')
  toggleStatus(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() updateStatusDto: UpdateStatusDto) {
    return this.conteudosService.updateStatus(req.user.userId, id, updateStatusDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.conteudosService.remove(req.user.userId, id);
  }
}
