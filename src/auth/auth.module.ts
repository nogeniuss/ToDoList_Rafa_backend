import { Module } from "@nestjs/common";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./jwt.strategy";

@Module({
    imports:[
        ConfigModule,
        PassportModule,
        JwtModule.registerAsync({
            imports:[ConfigModule],
            inject:[ConfigService],
            useFactory: (config: ConfigService): JwtModuleOptions => {
                return {
                secret: config.getOrThrow<string>('JWT_SECRET'),
                signOptions:{
                    expiresIn: config.getOrThrow<number>('JWT_EXPIRES_IN')
                }
            }
            }
        })
    ],
    controllers:[AuthController],
    providers:[AuthService, JwtStrategy],
    exports:[AuthService]
})

export class AuthModule {}