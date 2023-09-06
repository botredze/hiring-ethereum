import { Module } from '@nestjs/common';
import { ScheduleModule } from "nestjs-schedule";
import { EthereumController } from "./ethereum.controller";
import { EthereumService } from "./ethereum.service";
import { EthereumRepository } from "./ethereum.repository";
import { EthereumCronService } from "./ethereum.cron";


@Module({
  imports: [ ScheduleModule.forRoot(),],
  controllers: [EthereumController],
  providers: [EthereumCronService, EthereumService, EthereumRepository],
})
export class EthereumModule {}
