import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class ScheduleRuleCreateDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    pattern: string;

    @IsOptional()
    @IsString()
    active?: string; 
}