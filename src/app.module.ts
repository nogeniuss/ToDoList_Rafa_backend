import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './tasks/task.module';

@Module({
    imports:[
        ConfigModule.forRoot({
            isGlobal:true,
            envFilePath:'.env'
        }),
        AuthModule,TaskModule
    ],
})

export class AppModule {}