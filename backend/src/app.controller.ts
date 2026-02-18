import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController{
    @Get()
    async start(){
        return 'Server is running'
    }
    @Get("health")
    async get(){
        return {ok:true}
    }
}