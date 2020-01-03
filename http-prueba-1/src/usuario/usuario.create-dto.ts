import { IsNotEmpty, IsNumberString, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class UsuarioCreateDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  nombre:string;

  @IsNotEmpty()
  @IsNumberString()
  @MinLength(10)
  @MaxLength(10)
  cedula:string;
}