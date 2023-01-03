import { IsString, IsNumber } from 'class-validator';
// import { ResponseBase } from '../types';

export class GenericResponse {
  @IsString()
  message: string;

  @IsNumber()
  statusCode: number;

  constructor(message: string, statusCode?: number) {
    // super()
    this.message = message.trim();
    this.statusCode = statusCode ?? 200;
  }
}