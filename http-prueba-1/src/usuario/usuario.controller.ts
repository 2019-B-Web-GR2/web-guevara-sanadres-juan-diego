import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Session } from '@nestjs/common';
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
  hola(): string{
    return `
      <html>
        <head> <title> 3era Guerra Mundial </title></head>
        <body>
           <h1> Mi primera pagina web </h1>
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
  ): Promise<UsuarioEntity> {
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
  }

  @Put(':id')
  async actualizarUnUsuario(
    @Body() usuario: UsuarioEntity,
    @Param('id') id: string,
  ): Promise<UsuarioEntity> {
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
  }

  @Delete(':id')
  eliminarUnUsuario(
    @Param('id') id: string,
  ):Promise<DeleteResult>{
    return this._usuarioService
      .borrarUno(
        +id
      );
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