import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req, Res,
  Session,
} from '@nestjs/common';
import {UsuarioService} from "./usuario.service";
import {UsuarioEntity} from "./usuario.entity";
import { DeleteResult } from 'typeorm';
import * as Joi from '@hapi/joi';
import { UsuarioCreateDto } from './usuario.create-dto';
import { validate } from "class-validator";
import { UsuarioUpdateDto } from './usuario.update-dto';

@Controller('usuario')
export class UsuarioController {
  constructor(
    private readonly _usuarioService: UsuarioService,
  ) {

  }

  @Get('ejemploEJS')
  ejemploEJS(
    @Res() res
  ){
    res.render('ejemplo',{
      datos:{
        nombre:'Juxx',
        suma: this.suma,
        joi: Joi,
      },
    });
  }

  suma(numero1, numero2){
    return numero1 + numero2;
  }

  @Get('logout')
  logout(
    @Session() session,
    @Req() req
  ){
    session.usuario = undefined;
    req.session.destroy();
    return 'Deslogueado';
  }

  @Post('login')
  login(
    @Body('username')username:string,
    @Body('password')password:string,
    @Session() session
  ){
    console.log('Seesion',session);
    if(username === 'juxx' && password === 'cabrones1'){
      session.usuario = {
        nombre:'Juan',
        userId: 1,
        roles: ['Administrador']
      };
      return 'ok';
    }
    if(username === 'camch' && password === 'cabrones2'){
      session.usuario = {
        nombre:'Carlos',
        userId: 2,
        roles: ['Supervisor']
      };
      return 'ok';
    }
    throw new BadRequestException('No envio credenciales')
  }

  @Get('session')
  session(
    @Session() session
  ){
    return session;
  }

  @Get('hola')
  hola(
    @Session() session
  ): string{
    let contenidoHtml = '<ul>';
    if(session.usuario){
      session.usuario.roles.forEach(
        (nombreRol) => {
          contenidoHtml = contenidoHtml + `<li>${nombreRol}</li>`;
        }
      );
      contenidoHtml += '</ul>';
    }
    return `
      <html>
        <head> <title> 3era Guerra Mundial </title></head>
        <body>
           <h1> Mi primera pagina web ${session.usuario? session.usuario.nombre : ''}</h1>
           ${contenidoHtml}
        </body>
      </html> 
    `;
  }

  // GET /modelo/:id
  @Get(':id')
  obtenerUnUsuario(
    @Param('id') identificador: string,
  ): Promise<UsuarioEntity | undefined> {
    return this._usuarioService
      .encontrarUno(
        Number(identificador)
      );
  }

  @Post()
  async crearUsuario(
    @Body() usuario: UsuarioEntity,
    @Session() session
  ): Promise<UsuarioEntity> {
    if(session.usuario.roles[0] === 'Administrador'){
      const usuarioCreateDTO = new UsuarioCreateDto();
      usuarioCreateDTO.nombre = usuario.nombre;
      usuarioCreateDTO.cedula = usuario.cedula;
      const errores = await validate(usuarioCreateDTO);
      console.log(errores);
      if(errores.length > 0 ){
        throw new BadRequestException('Error validando');
      }else{
        return this._usuarioService.crearUno(usuario);
      }
    }else{
      throw new BadRequestException('Usuario no permitido para Crear')
    }
  }

  @Put(':id')
  async actualizarUnUsuario(
    @Body() usuario: UsuarioEntity,
    @Param('id') id: string,
    @Session() session
  ): Promise<UsuarioEntity> {
    if(session.usuario.roles[0] === 'Administrador' || session.usuario.roles[0] === 'Supervisor'){
      const usuarioUpdateDTO = new UsuarioUpdateDto();
      usuarioUpdateDTO.nombre = usuario.nombre;
      usuarioUpdateDTO.cedula = usuario.cedula;
      usuarioUpdateDTO.id = +id;
      const errores = await validate(usuarioUpdateDTO);
      console.log(errores);
      if (errores.length > 0) {
        throw new BadRequestException('Error validando');
      } else {
        return this._usuarioService
          .actualizarUno(
            +id,
            usuario,
          );
      }
    }else{
      throw new BadRequestException('Usuario no permitido para Actualizar')
    }
  }

  @Delete(':id')
  eliminarUnUsuario(
    @Param('id') id: string,
    @Session() session
  ):Promise<DeleteResult>{

    if(session.usuario.roles[0] === 'Administrador'){
      return this._usuarioService
        .borrarUno(
          +id
        );
    }else{
      throw new BadRequestException('Usuario no permitido para Eliminar')
    }
  }

  @Get()
  async buscar(
    @Query('skip')skip?: string | number,
    @Query('take')take?: string | number,
    @Query('where')where?: string,
    @Query('order')order?: string
  ):Promise<UsuarioEntity[]>{
    if(order){
      try{
        order = JSON.parse(order);
      }catch (e) {
        order = undefined;
      }
    }
    if(where){
      try{
        where = JSON.parse(where);
      }catch (e) {
        where = undefined;
      }
    }
    if(skip){
      skip = +skip;
      // const nuevoEsquema = Joi.object({
      //     skip: Joi.number()
      // });
      // try {
      //     const objetoValidado = await nuevoEsquema
      //         .validateAsync({
      //             skip: skip
      //         });
      //     console.log('objetoValidado', objetoValidado);
      // } catch (error) {
      //     console.error('Error',error);
      // }
    }
    if(take){
      take = +take;
    }
    return this._usuarioService
      .buscar(
        where,
        skip as number,
        take as number,
        order
      )
  }


}
