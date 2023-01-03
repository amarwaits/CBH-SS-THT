// import { ResponseBase } from "../types";

export class LoginResponse {
  status: boolean
  message?: string
  token?: string;

  constructor(status: boolean, message?: string, token?: string) {
    // super()
    this.status = status
    this.message = message
    this.token = token
  }
}