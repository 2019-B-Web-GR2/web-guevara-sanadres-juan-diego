import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import {UsuarioService} from "./usuario.service";
import {UsuarioEntity} from "./usuario.entity";
import { DeleteResult } from 'typeorm';
import * as Joi from '@hapi/joi';
import { UsuarioCreateDto } from './usuario.create-dto';
import { validate } from "class-validator";

@Controller('usuario')
export class UsuarioController {
  constructor(
    private readonly _usuarioService: UsuarioService,
  ) {

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
    if(errores.length > 0 ){
      throw new BadRequestException('Error validando');
      
    }else{
      return this._usuarioService.crearUno(usuario);
    }
  }

  @Put(':id')
  actualizarUnUsuario(
    @Body() usuario: UsuarioEntity,
    @Param('id') id: string,
  ):Promise<UsuarioEntity>{
    return this._usuarioService
      .actualizarUno(
        +id,
        usuario,
      );
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