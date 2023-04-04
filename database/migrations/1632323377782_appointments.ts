import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Appointments extends BaseSchema {
  protected tableName = 'appointments'

  public async up() {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.increments('id')
      table.timestamp('start_at')
      table.timestamp('finish_at')
      table.string('observation')
      table.string('status')
      table.double('value')
      table.string('address')
      table.timestamp('payed_at')
      table.timestamp('started_at')
      table.timestamp('finished_at')
      table.timestamp('cancelled_at')
      table.boolean('customer_rating')
      table.boolean('provider_rating')
      table.integer('duration')
      table.boolean('address_of_customer')
      table.integer('provider_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('providers')
      table.integer('customer_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('customers')
      table.integer('provider_service_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('provider_services')
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
