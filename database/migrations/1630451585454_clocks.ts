import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Clocks extends BaseSchema {
  protected tableName = 'clocks'

  public async up () {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.increments('id').primary().notNullable().unsigned()
      table.boolean('enabled')
      table.string('name')
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
