// Validation for interview answer submission
import { IsInt, IsString, Min, MinLength, MaxLength } from 'class-validator';

export class SubmitAnswerDto {
  @IsInt()
  @Min(0)
  questionIndex: number;

  @IsString()
  @MinLength(1)
  @MaxLength(10000)
  answer: string;
}
