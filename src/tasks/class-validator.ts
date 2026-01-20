import { IsEmail, IsString, MinLength, IsOptional, IsNumber, IsDateString, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {

    @ApiProperty({ example: '1', required: true })
    @IsString({ message: 'Id User inválido' })
    id_user: string;

    @ApiProperty({ example: '26-01-2021', required: true })
    @IsDateString({}, { message: 'Data Invalida' })
    data: Date;

    @ApiProperty({ example: 'titulo ....', required: true })
    @IsString({ message: 'Titulo inválido' })
    titulo: string;


    @ApiProperty({ example: 'descricao ....', required: false })
    @IsString({ message: 'Descricao inválido' })
    @IsOptional()
    descricao?: string;

    @ApiProperty({ example: '1', required: true })
    @IsNumber({}, { message: 'Prioridade inválido' })
    prioridade: number;
}

export class UpdateTaskDto {

    @ApiProperty({ example: '1', required: true })
    @IsString({ message: 'Id user update inválido' })
    id_user: string;

    @ApiProperty({ example: '26-01-2021', required: false })
    @IsDateString({}, { message: 'Data Invalida' })
    @IsOptional()
    data?: Date;

    @ApiProperty({ example: 'titulo ....', required: false })
    @IsString({ message: 'Titulo inválido' })
    @IsOptional()
    titulo?: string;


    @ApiProperty({ example: 'descricao ....', required: false })
    @IsString({ message: 'Descricao inválido' })
    @IsOptional()
    descricao?: string;

    @ApiProperty({ example: '1', required: false })
    @IsNumber({}, { message: 'Prioridade inválido' })
    @IsOptional()
    prioridade?: number;

    @ApiProperty({ example: 'true', required: false })
    @IsBoolean({ message: 'Valor inválido' })
    @IsOptional()
    concluida?: boolean;

}