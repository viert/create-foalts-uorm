import { HttpResponse } from "@foal/core";

export class ApiHttpResponse extends HttpResponse {
  statusCode: number;
  statusMessage = "";
  constructor(body: any, statusCode: number) {
    super(body);
    this.statusCode = statusCode;
  }
}
