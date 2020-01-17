import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsuarioEntity} from "./usuario/usuario.entity";
import {UsuarioModule} from "./usuario/usuario.module";
import {UsuarioService} from "./usuario/usuario.service";

@Module({
  imports: [
    UsuarioModule,
    TypeOrmModule.forRoot(
      {
        name: 'default', // Nombre cadena de Conex.
        type: 'mysql',
        host: 'localhost',
        port: 32769,
        username: 'root',
        password: 'root',
        database: 'webP',
        dropSchema: false,
        entities: [
          UsuarioEntity
        ],
        synchronize: true, // Crear -> true , Conectar -> false
      }
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(
    // tslint:disable-next-line:variable-name
    private _usuarioService: UsuarioService,
  ) {
    const usuarioPromesa = this._usuarioService.encontrarUno(1);
    usuarioPromesa
      .then()
      .catch();
  }
}
