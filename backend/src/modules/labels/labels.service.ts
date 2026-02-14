import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateLabelDto } from './dto/create-label.dto';

@Injectable()
export class LabelsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAll() {
    return await this.databaseService.label.findMany();
  }

  async create(dto: CreateLabelDto) {
    await this.databaseService.label.create({
      data: {
        ...dto,
      },
    });

    return { message: 'Created' };
  }
  async delete(id:string) {

    const issueCount=await this.databaseService.issue.count({
        where:{
            labels:{
                some:{
                    id
                }
            }
        }
    })
    if(issueCount>0) throw new BadRequestException("Label is still in use")

    await this.databaseService.label.delete({
      where: {
        id
      },
    });

    return { message: 'Deleted' };
  }
}
