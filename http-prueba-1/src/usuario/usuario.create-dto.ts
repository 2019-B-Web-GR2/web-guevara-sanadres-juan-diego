import { IsNotEmpty, IsNumberString, IsString, Max, Min } from 'class-validator';

export class UsuarioCreateDto {
  @IsNotEmpty()
  @IsString()
  @Min(3)
  @Max(80)
  nombre:string;

  @IsNotEmpty()
  @IsNumberString()
  @Min(10)
  @Max(10)
  cedula:string;
}