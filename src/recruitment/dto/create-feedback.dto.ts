import {IsMongoId, IsString , isMongoId  , IsInt , IsOptional} from "class-validator";

export class CreateFeedbackDto {

  @IsMongoId()
  interviewId: string;

  @IsMongoId()
  interviewerId: string;

  @IsMongoId()
  candidateId: string;

  @IsInt()
  score: number;

  @IsOptional()
  @IsString()
  comments?: string ;

}