import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { TrilhasService } from './trilhas.service';
import { CreateTrilhaDto } from './dto/create-trilha.dto';
import { UpdateTrilhaDto } from './dto/update-trilha.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('trilhas')
@UseGuards(JwtAuthGuard)
export class TrilhasController {
  constructor(private readonly trilhasService: TrilhasService) {}

  @Post()
  create(@Req() req: any, @Body() createTrilhaDto: CreateTrilhaDto) {
    return this.trilhasService.create(req.user.userId, createTrilhaDto);
  }

  @Get()
  findAll(
    @Req() req: any,
    @Query('page') page: string = '1', 
    @Query('limit') limit: string = '10',
  ) {
    return this.trilhasService.findAll(req.user.userId, +page, +limit);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.trilhasService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() updateTrilhaDto: UpdateTrilhaDto) {
    return this.trilhasService.update(req.user.userId, id, updateTrilhaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.trilhasService.remove(req.user.userId, id);
  }
}
