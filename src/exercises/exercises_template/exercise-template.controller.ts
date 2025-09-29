import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ExerciseTemplateService } from './exercise-template.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateExerciseTemplateDto } from '../dto/create-exercise-template.dto';
import { ExerciseTemplate } from './exercise-template.entity';

@ApiTags('Exercise Templates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('exercise-templates')
export class ExerciseTemplateController {
  constructor(private readonly templateService: ExerciseTemplateService) {}

  @Post()
  @ApiOperation({ summary: 'Dodaj nowy szablon ćwiczenia' })
  @ApiResponse({ status: 201, description: 'Szablon został dodany', type: ExerciseTemplate })
  create(@Body() dto: CreateExerciseTemplateDto): Promise<ExerciseTemplate> {
    return this.templateService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Pobierz wszystkie szablony ćwiczeń' })
  @ApiResponse({ status: 200, description: 'Lista szablonów', type: [ExerciseTemplate] })
  findAll(): Promise<ExerciseTemplate[]> {
    return this.templateService.findAll();
  }
}
