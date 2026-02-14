import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { IssuesService } from "./issues.service";
import { IssuesController } from "./issues.controller";

@Module({
    imports:[DatabaseModule],
    providers:[IssuesService],
    controllers:[IssuesController]
})
export class IssuesModule{}

