import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString, Min } from "class-validator";

export class GetIussesParamsDto {
    @Type(()=>Number)
    @IsInt()
    @Min(1)
    page:number=1;
    
    @Type(()=>Number)
    @IsInt()
    @Min(1)
    limit:number=8;

    @IsOptional()
    @IsString()
    term?:string;
    
    @IsOptional()
    @IsString()
    sortBy?:string;

    @IsOptional()
    @IsIn(['asc','desc'])
    sortDir?:'asc'|'desc'
}