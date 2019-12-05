import {Body, Controller, Delete, Get, Headers, HttpCode, Post, Put, Query} from '@nestjs/common';
import { AppService } from './app.service';

let total:number = 100;
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('suma')
  @HttpCode(200)
  public sumar(
      @Headers() cabeceras:any,
      @Headers('numero1') numero1:string,
      @Headers('numero2') numero2:string,
  ){
    const resultado: number=parseInt(numero1)+parseInt(numero2);
    total = (total-resultado);
    return this.mensaje();

  }

  @Post('resta')
  @HttpCode(201)
  public restar(
      @Body('numero1') numero1: string,
      @Body('numero2') numero2:string
  ):string{
    const resultado: number=parseInt(numero1)-parseInt(numero2);
    total = (total-resultado);
    return this.mensaje();
  }

  @Put('multiplicacion')
  @HttpCode(202)
  public multiplicar(
      @Query('numero1')numero1:string,
      @Query('numero2')numero2:string
  ){

    const resultado: number=parseInt(numero1)*parseInt(numero2);
    total = total - resultado;
    return this.mensaje();
  }

  @Delete('division')
  @HttpCode(200)
  public dividir(
      @Headers() cabeceras:any,
      @Headers('numero1') numero1:string,
      @Headers('numero2') numero2:string,
  ){
    const resultado: number=parseInt(numero1)/parseInt(numero2);
    total = total - resultado
    return this.mensaje();
  }

  public mensaje():string{
    if (total < 0) {
      total = 100;
      return 'Juego Terminado';
      
    } else {
      return `Resultado : ${total}`;

    }

  }
}
