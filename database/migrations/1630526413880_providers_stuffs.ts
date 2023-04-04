import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProvidersStuffs extends BaseSchema {
  protected tableName = 'providers_stuffs'

  public async up() {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.increments('id')
      table.integer('provider_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('providers')
      table.integer('stuff_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('stuffs')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
