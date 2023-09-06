import { Logger } from "@nestjs/common";
import { EthereumRepository } from "./ethereum.repository";
import { Cron } from 'nestjs-schedule';

export class EthereumCronService {
  private readonly logger = new Logger(EthereumCronService.name)

  constructor(private readonly etherRepository: EthereumRepository){}

  @Cron('0 * * * * *')
  async handleCron(){
    this.logger.debug('Cron job started')

    const latestBlockNumber = await this.etherRepository.getLatestBlockNumber()
    const startBlockNumber = 175830000

    for(let blockNumber = startBlockNumber; blockNumber <= latestBlockNumber; blockNumber++ ){
      try{
       const transactions = await  this.etherRepository.getBlockTransactions(blockNumber);

       for(const transaction of transactions) {
         await this.etherRepository.saveTransaction(transaction)
       }
      }catch (error) {
        this.logger.error(`Error processing block ${blockNumber}: ${error.message}`)
      }
    }

    this.logger.debug("Cron job completed")
  }
}