import { PartialType } from '@nestjs/swagger';
import { CreateWorkoutAssignmentDto } from './create-workout-assignment.dto';

export class UpdateWorkoutAssignmentDto extends PartialType(CreateWorkoutAssignmentDto) {}
