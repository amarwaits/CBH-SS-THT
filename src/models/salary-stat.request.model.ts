import 'reflect-metadata';
import { IsNotEmpty, IsString, IsOptional, IsNumberString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateSalaryRecordRequest {
  @Transform((value: string) => value.toLowerCase())
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNumberString()
  @IsNotEmpty()
  salary: string;

  @Transform((value: string) => value.toLowerCase())
  @IsString()
  @IsNotEmpty()
  currency: string

  @Transform((value: string) => value.toLowerCase())
  @IsString()
  @IsNotEmpty()
  department: string

  @Transform((value: string) => value.toLowerCase())
  @IsString()
  @IsNotEmpty()
  sub_department: string

  @Transform((value: string) => value.toLowerCase() === 'true' ? true : value.toLowerCase() === 'false' ? false : undefined)
  @IsOptional()
  on_contract: boolean = false
}

export class DeleteSalaryRecordRequest {
  @Transform((value: string) => value.toLowerCase())
  @IsString()
  @IsNotEmpty()
  name: string

  @Transform((value: string) => value.toLowerCase())
  @IsString()
  @IsNotEmpty()
  department: string

  @Transform((value: string) => value.toLowerCase())
  @IsString()
  @IsNotEmpty()
  sub_department: string
}