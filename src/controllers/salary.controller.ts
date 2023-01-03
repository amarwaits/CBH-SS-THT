import 'reflect-metadata'
import { JsonController, Get, Delete, Put, Body, QueryParam } from 'routing-controllers'

import SalaryStatsService from '../services/salary-stats.service'
import { CreateSalaryRecordRequest, DeleteSalaryRecordRequest, GenericSalaryStatsResponse } from '../models'

@JsonController('/salary-stat')
export class SalaryStatsController {
  private salaryStatsService = SalaryStatsService

  @Get('/')
  public async getOverallStats(@QueryParam('contractOnly', { required: false, type: Boolean }) contractOnly: boolean = false): Promise<GenericSalaryStatsResponse> {
    try {
      const response = this.salaryStatsService.getStats(contractOnly)
      return new GenericSalaryStatsResponse(true, undefined, response)
    } catch (err) {
      return new GenericSalaryStatsResponse(false, (err as Error).message)
    }
  }

  @Get('/department')
  public async getDepartmentStats(): Promise<GenericSalaryStatsResponse> {
    try {
      const response = this.salaryStatsService.getDepartmentStats()
      return new GenericSalaryStatsResponse(true, undefined, response)
    } catch (err) {
      return new GenericSalaryStatsResponse(false, (err as Error).message)
    }
  }

  @Put('/record')
  public async createSalaryRecord(@Body() body: CreateSalaryRecordRequest): Promise<GenericSalaryStatsResponse> {
    try {
      this.salaryStatsService.addRecord(body.name, parseFloat(body.salary), body.currency, body.sub_department, body.department, body.on_contract)
      return new GenericSalaryStatsResponse(true)
    } catch (err) {
      return new GenericSalaryStatsResponse(false, (err as Error).message)
    }
  }

  @Delete('/record')
  public async deleteSalaryRecord(@Body() body: DeleteSalaryRecordRequest): Promise<GenericSalaryStatsResponse> {
    try {
      this.salaryStatsService.deleteRecord(body.name, body.sub_department, body.department)
      return new GenericSalaryStatsResponse(true)
    } catch (err) {
      return new GenericSalaryStatsResponse(false, (err as Error).message)
    }
  }

  @Get('/sub-department')
  public async getSubDepartmentStats(): Promise<GenericSalaryStatsResponse> {
    try {
      const response = this.salaryStatsService.getSubDepartmentStats()
      return new GenericSalaryStatsResponse(true, undefined, response)
    } catch (err) {
      return new GenericSalaryStatsResponse(false, (err as Error).message)
    }
  }
}