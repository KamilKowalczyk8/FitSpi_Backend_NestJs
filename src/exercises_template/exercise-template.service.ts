import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseTemplate } from './exercise-template.entity';
import { CreateExerciseTemplateDto } from './dto/create-exercise-template.dto';

@Injectable()
export class ExerciseTemplateService {
  constructor(
    @InjectRepository(ExerciseTemplate)
    private readonly templateRepo: Repository<ExerciseTemplate>,
  ) {}

  async create(dto: CreateExerciseTemplateDto): Promise<ExerciseTemplate> {
    const exists = await this.templateRepo.findOne({ where: { name: dto.name } });
    if (exists) throw new ConflictException('Taki szablon już istnieje');

    const template = this.templateRepo.create({ name: dto.name });
    return this.templateRepo.save(template);
  }

  async findAll(): Promise<ExerciseTemplate[]> {
    return this.templateRepo.find({ order: { name: 'ASC' } });
  }
}
