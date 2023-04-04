import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('account_type_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('account_types')
      table.integer('status_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('statuses')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('account_type_id')
      table.dropColumn('status_id')
    })
  }
}
