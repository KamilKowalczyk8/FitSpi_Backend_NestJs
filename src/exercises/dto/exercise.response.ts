import { WeightUnits } from "../weight_units.enum";

export class ExerciseResponse {
  id: number;
  name: string;
  templateId: number;
  sets: number;
  reps: number;
  weight: number;
  weightUnits: WeightUnits;
  workoutId: number;
}
