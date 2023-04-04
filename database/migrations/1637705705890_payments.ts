import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Payments extends BaseSchema {
  protected tableName = 'payments'

  public async up() {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.increments('id').primary().notNullable().unsigned()
      table.integer('appointment_id').notNullable().unsigned()
      table.integer('provider_id').notNullable().unsigned()
      table.string('provider_stripe_id').notNullable().unsigned()
      table.integer('customer_id').notNullable().unsigned()
      table.float('total_value').notNullable()
      table.float('provider_earn').notNullable()
      table.float('app_fee').notNullable()
      table.string('status_provider_earn').notNullable()
      table.timestamp('payed_at').notNullable()
      table.timestamp('available_at')
      table.timestamp('canceled_at')
      table.string('transaction_id')

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
