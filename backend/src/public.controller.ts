import { Controller, Get } from '@nestjs/common'

@Controller('')
export class PublicController {
  @Get()
  findAll() {
    return []
  }
}
