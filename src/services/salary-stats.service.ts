import { MyCache } from '../cache';

import { CONTRACT_ONLY_STATS_KEY, DEPARTMENT_STATS_KEY, OVERALL_STATS_KEY, SUBDEPARTMENT_STATS_KEY } from "../constants";

class SalaryStatsService {
  private recordMap: { [key: string]: { name: string, salary: number, currency: string, department: string, subDepartment: string, onContract: boolean } } = {}

  public addRecord(name: string, salary: number, currency: string, subDepartment: string, department: string, onContract: boolean) {
    let key = `${name}-${department}-${subDepartment}`
    if (this.recordMap[key]) {
      throw new Error('Record Already Exist')
    }
    this.recordMap[key] = { name, salary, currency, department, subDepartment, onContract }

    // clear cache
    MyCache.del([OVERALL_STATS_KEY, CONTRACT_ONLY_STATS_KEY, DEPARTMENT_STATS_KEY, SUBDEPARTMENT_STATS_KEY])
    console.log('-----------------> Records:', JSON.stringify(this.recordMap))
  }

  public deleteRecord(name: string, subDepartment: string, department: string) {
    let key = `${name}-${department}-${subDepartment}`
    if (!this.recordMap[key]) {
      throw new Error('Record Not Exist')
    }
    delete this.recordMap[key]

    // clear cache
    MyCache.del([OVERALL_STATS_KEY, CONTRACT_ONLY_STATS_KEY, DEPARTMENT_STATS_KEY, SUBDEPARTMENT_STATS_KEY])
  }

  public getStats(onlyContract: boolean): { min: number, max: number, mean: number } {
    let cacheKey = onlyContract ? OVERALL_STATS_KEY : CONTRACT_ONLY_STATS_KEY
    const cacheResponse = MyCache.get(cacheKey)
    if (cacheResponse)
      return cacheResponse

    const response = { min: Number.MAX_VALUE, max: Number.MIN_VALUE, mean: 0 }
    let sum = 0, count = 0, recordFound = false

    for (let key in this.recordMap) {
      let record = this.recordMap[key]
      if ((onlyContract && record!.onContract) || !onlyContract) {
        if (!recordFound)
          recordFound = true
        count++
        sum += record!.salary
        if (record!.salary < response.min)
          response.min = record!.salary
        if (record!.salary > response.max)
          response.max = record!.salary
      }
    }

    if (recordFound)
      response.mean = Math.floor(sum / count)
    else
      response.min = response.max = 0
    MyCache.set(cacheKey, response)

    return response
  }

  public getDepartmentStats(): { [key: string]: { min: number, max: number, mean: number } } {
    const cacheResponse = MyCache.get(DEPARTMENT_STATS_KEY)
    if (cacheResponse)
      return cacheResponse

    const response: { [key: string]: { min: number, max: number, mean: number } } = {}
    const sumNcount: { [key: string]: { sum: number, count: number } } = {}

    for (let key in this.recordMap) {
      let record = this.recordMap[key]
      if (!response[record!.department]) {
        response[record!.department] = { min: Number.MAX_VALUE, max: Number.MIN_VALUE, mean: 0 }
        sumNcount[record!.department] = { sum: 0, count: 0 }
      }
      sumNcount[record!.department].count++
      sumNcount[record!.department].sum += record!.salary
      if (record!.salary < response[record!.department].min)
        response[record!.department].min = record!.salary
      if (record!.salary > response[record!.department].max)
        response[record!.department].max = record!.salary
    }

    for (let department in sumNcount)
      response[department].mean = Math.floor(sumNcount[department].sum / sumNcount[department].count)

    MyCache.set(DEPARTMENT_STATS_KEY, response)
    return response
  }

  public getSubDepartmentStats(): { [key: string]: { [key: string]: { min: number, max: number, mean: number } } } {
    const cacheResponse = MyCache.get(SUBDEPARTMENT_STATS_KEY)
    if (cacheResponse)
      return cacheResponse

    const response: { [key: string]: { [key: string]: { min: number, max: number, mean: number } } } = {}
    const sumNcount: { [key: string]: { [key: string]: { sum: number, count: number } } } = {}

    for (let key in this.recordMap) {
      let record = this.recordMap[key]
      if (!response[record!.department]) {
        response[record!.department] = {}
        sumNcount[record!.department] = {}
      }
      if (!response[record!.department][record!.subDepartment]) {
        response[record!.department][record!.subDepartment] = { min: Number.MAX_VALUE, max: Number.MIN_VALUE, mean: 0 }
        sumNcount[record!.department][record!.subDepartment] = { sum: 0, count: 0 }
      }
      sumNcount[record!.department][record!.subDepartment].count++
      sumNcount[record!.department][record!.subDepartment].sum += record!.salary
      if (record!.salary < response[record!.department][record!.subDepartment].min)
        response[record!.department][record!.subDepartment].min = record!.salary
      if (record!.salary > response[record!.department][record!.subDepartment].max)
        response[record!.department][record!.subDepartment].max = record!.salary
    }

    for (let department in sumNcount)
      for (let subDepartment in sumNcount[department])
        response[department][subDepartment].mean = Math.floor(sumNcount[department][subDepartment].sum / sumNcount[department][subDepartment].count)

    MyCache.set(SUBDEPARTMENT_STATS_KEY, response)
    return response
  }
}

export default new SalaryStatsService()