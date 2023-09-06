import { Column, PrimaryGeneratedColumn } from "typeorm";

export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  blockNumber: number;
  @Column()
  fromAddress: string;
  @Column()
  toAddress: string;
  @Column('bigint')
  value: string
}