import { Logger } from "@nestjs/common";
import { Repository } from "typeorm";
import { Transaction } from "./entites/transaction.entity";
import { Address } from "./entites/address.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { TransactionResponseDto } from "./dto/transaction.response.dto";
import axios from 'axios'
import { GetAddressDto } from "./dto/get.address.dto";
import { GetBalanceDto } from "./dto/get.balance.dto";

export class EthereumRepository {
  private etherscanAPIKey = ''
  private  readonly  logger = new Logger(EthereumRepository.name)

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>
  ){}

  async saveTransaction(transactionData: TransactionResponseDto) {
    try {
      const transaction = new Transaction();
      transaction.blockNumber= transactionData.blockNumber;
      transaction.fromAddress = transactionData.fromAddress;
      transaction.toAddress = transactionData.toAddress;
      transaction.value = transactionData.value;

      await  this.transactionRepository.save(transaction)
      this.logger.debug(`Transaction saved: ${transaction.id}`)
    }catch (err) {
      this.logger.error('Saving error', err.message)
      throw  err
    }
  }

  async getLatestBlockNumber(): Promise<number> {
    try {
      const response = await axios.get(`https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${this.etherscanAPIKey}`,)

      const blockNumberHex = response.data.result;
      const blockNumber = parseInt(blockNumberHex, 16)
      return  blockNumber
    }catch (error){
      this.logger.error(`Error getting error: ${error.message}`)
      throw  error;
    }
  }

  async getAddressBalanceChange(dto: GetAddressDto): Promise<number> {
    const {changeAddress, lastBlocksCount}= dto
    try {
      const response = await axios.get(
        `https://api.etherscan.io/api?module=account&action=balance&address=${changeAddress}&tag=latest&apikey=${this.etherscanAPIKey}`,
      );

      const currentBalanceWei = parseInt(response.data.result);
      const blockNumber = await this.getLatestBlockNumber() - lastBlocksCount;
      const address = changeAddress
      const previousBalanceWei = await this.getBalanceAtBlock({address, blockNumber})

      return currentBalanceWei - previousBalanceWei;
    }catch (error) {
      this.logger.error(`Error getting balance ${error.message}`)
    }
  }

  async getAllAddresses(): Promise<Address[]> {
    try {
      return await this.addressRepository.find();
    } catch (error) {
      this.logger.error(`Error getting all addresses: ${error.message}`);
      throw error;
    }
  }

  async getBalanceAtBlock(dto: GetBalanceDto): Promise<number> {
    const {address, blockNumber} = dto
    try {
      const response = await axios.get(
        `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=${blockNumber.toString(16)}&apikey=${this.etherscanAPIKey}`,
      );

      const balanceWei = parseInt(response.data.result);
      return balanceWei;
    } catch (error) {
      this.logger.error(`Error getting balance for address ${address} at block ${blockNumber}: ${error.message}`);
      throw error;
    }
  }


  async getBlockTransactions(blockNumber: number): Promise<any[]> {
    try {
      const response = await axios.get(
        `https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=${blockNumber.toString(16)}&boolean=true&apikey=${this.etherscanAPIKey}`,
      );

      const block = response.data.result;
      if (!block || !block.transactions) {
        return [];
      }

      const transactions = block.transactions.map((tx: any) => {
        return {
          blockNumber: block.number,
          from: tx.from,
          to: tx.to,
          value: tx.value,
        };
      });

      return transactions;
    } catch (error) {
      this.logger.error(`Error getting transactions for block ${blockNumber}: ${error.message}`);
      throw error;
    }
  }
}