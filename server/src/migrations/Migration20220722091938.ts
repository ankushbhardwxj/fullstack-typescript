import { Migration } from '@mikro-orm/migrations';

export class Migration20220722091938 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "post" ("id" serial primary key, "created_at" jsonb not null, "updated_at" jsonb not null, "title" varchar(255) not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "post" cascade;');
  }

}
