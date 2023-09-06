// address migration file
import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateAddress1631929782365 implements MigrationInterface {
  name = 'CreateAddress1631929782365'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "address" (
                "id" SERIAL NOT NULL,
                "address" character varying NOT NULL,
                "balance" character varying NOT NULL,
                CONSTRAINT "PK_id" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "address"
        `);
  }
}
