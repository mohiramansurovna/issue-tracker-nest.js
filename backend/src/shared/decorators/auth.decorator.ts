import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser=createParamDecorator((_:unknown,ctx:ExecutionContext)=>{
    const req=ctx.switchToHttp().getRequest();
    return req.user;
})

export const CurrentUserId=createParamDecorator((_:unknown,ctx:ExecutionContext)=>{
    const req=ctx.switchToHttp().getRequest();
    return req.user?.id as string;
})
