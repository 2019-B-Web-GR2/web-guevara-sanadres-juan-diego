import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

let surname: string = 'Guevara';
const cedula: string = '060...';

surname = 'Sanandres';

const married: boolean = false;
const age: number = 21;
const salary: number = 3.94;
let hijos = 0;
hijos = null;
// tslint:disable-next-line:prefer-const
let ojos;
if (married === false){
}
