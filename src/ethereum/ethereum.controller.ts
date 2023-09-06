import { Controller, Get, Query } from '@nestjs/common';
import { EthereumService } from './ethereum.service';

@Controller('ethereum')
export class EthereumController {
  constructor(private readonly ethereumService: EthereumService) {}

  @Get('max-balance')
  async getAddressWithMaxBalanceChange(@Query('lastBlocksCount') lastBlocksCount: number = 100) {
    const address = await this.ethereumService.getAddressWithMaxBalanceChange(lastBlocksCount);
    return { address };
  }
}
