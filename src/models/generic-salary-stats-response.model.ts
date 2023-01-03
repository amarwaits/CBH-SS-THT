// import { ResponseBase } from "../types"

export class GenericSalaryStatsResponse {
  status: boolean
  message?: string
  data?: any

  constructor(status: boolean, message?: string, data?: any) {
    // super()
    this.status = status
    this.message = message
    this.data = data
  }
}