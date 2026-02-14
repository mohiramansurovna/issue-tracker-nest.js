import { Module } from "@nestjs/common";
import { AuthService } from "@/modules/auth/auth.service";
import { AuthController } from "@/modules/auth/auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { DatabaseModule } from "../database/database.module";
import { AuthTokenStrategy } from "./strategies/auth-token.strategy";

@Module({
    imports:[DatabaseModule, JwtModule],
    providers:[AuthService,AuthTokenStrategy],
    controllers:[AuthController],
})
export class AuthModule{}