import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import {ConfigService} from '@nestjs/config'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('DB_HOST'),
        port: configService.getOrThrow('DB_PORT'),
        database: configService.getOrThrow('DB_DATABASE'),
        username: configService.getOrThrow('DB_USER'),
        password: configService.getOrThrow('DB_PASSWORD'),
        autoLoadEntities: true,
        synchronize: configService.getOrThrow('DB_SYNCHON')
      }),
      inject: [ConfigService]
    })
  ]
})
export class DatabaseModule {}
