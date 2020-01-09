import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller('juxxi')
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @HttpCode(200)

  @Post()
  byeWorld(): string {
    const seconds = this.getSeconds();
    if (seconds % 2 === 0) {
      return 'Adios Mundo!';
    } else {
      throw new InternalServerErrorException(
        'Es impar',
      );
    }

  }

  private getSeconds(): number {
    return new Date().getSeconds();
  }
  //parametros de ruta = oligatorio //parametros de consulta = no obligatorios
  @Get('inscripcion-curso/:idCurso/:cedula') // /:nombreDelParametro
  public inscripcionCurso(
    // Siempre tipar cualquier cosa que usamos
    @Param() parametrosDeRuta:ObjetoInscripcion,
    @Param('idCedula') idCedula:string,
    @Param('cedula') cedula:string
  ): string {
    console.log(parametrosDeRuta);
    // template strings \\ `Mensaje ${variable}`
    return `Te inscribiste al curso: ${parametrosDeRuta.idCurso} 
    Cedula: ${parametrosDeRuta.cedula}`;
  }

  @Post('almorzar')
  @HttpCode(200)
  public almorzar(
    @Body() parametroDeCuerpo,
    @Body('id') id:number
  ):string{
    console.log(parametroDeCuerpo);
    return `Te inscribiste al curso ${parametroDeCuerpo}`
  }

  @Get('obtener-cabeceras')
  obtenerCabeceras(
    @Headers() cabeceras,
    @Headers('numeroUno') numeroUno: string
  ): string{
    console.log(cabeceras);
    return `Las cabeceras son: ${cabeceras}`;
  }

}

interface ObjetoInscripcion{
  idCurso: string;
  cedula: string;
}
