import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { LabelsService } from './labels.service';
import { CreateLabelDto } from './dto/create-label.dto';

@Controller('labels')
export class LabelsController {
  constructor(private readonly labelService: LabelsService) {}

  @Get()
  async getAll() {
    const labels = await this.labelService.getAll();
    return labels
  }
1
  @Post()
  async create(@Body() body: CreateLabelDto) {
    return this.labelService.create(body);
  }

  @Delete(':id')
  async deleteLabel(@Param() id:string) {
    return this.labelService.delete(id);
  }
}
