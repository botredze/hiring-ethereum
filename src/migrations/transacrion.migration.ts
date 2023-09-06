import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTransaction1631929767752 implements MigrationInterface {
  name = 'CreateTransaction1631929767752'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "transaction" (
                "id" SERIAL NOT NULL,
                "blockNumber" integer NOT NULL,
                "fromAddress" character varying NOT NULL,
                "toAddress" character varying NOT NULL,
                "value" bigint NOT NULL,
                CONSTRAINT "PK_id" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "transaction"
        `);
  }
}
