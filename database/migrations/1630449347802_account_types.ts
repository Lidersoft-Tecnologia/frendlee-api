import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AccountTypes extends BaseSchema {
  protected tableName = 'account_types'

  public async up () {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.increments('id').notNullable().unsigned().unique()
      table.string('name').notNullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
