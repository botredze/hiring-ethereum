import { Injectable } from '@nestjs/common';
import { EthereumRepository } from "./ethereum.repository";

@Injectable()
export class EthereumService {
  constructor(private readonly ethereumRepository: EthereumRepository){}

  async getAddressWithMaxBalanceChange(lastBlocksCount: number) {
    const  addresses = await this.ethereumRepository.getAllAddresses()

    let maxChangeAddress = ''
    let maxChangeAmount = 0;

    for (const address of addresses) {
      const changeAddress = address.address
      const balanceChange = await this.ethereumRepository.getAddressBalanceChange(
        {changeAddress,
        lastBlocksCount}
      );

      if(Math.abs(balanceChange)> Math.abs(maxChangeAmount)) {
        maxChangeAddress= address.address;
        maxChangeAmount= balanceChange;
      }
    }

    return maxChangeAddress
  }
}
