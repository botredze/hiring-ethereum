import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from "@nestjs/config";
import { EthereumModule } from './ethereum/ethereum.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    DatabaseModule,
    EthereumModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
