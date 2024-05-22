import { IsOptional } from "class-validator";

export class UpdateClassDto {
    @IsOptional()
    name: string;

    @IsOptional()
    is_active: boolean;

}