import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Customers extends BaseSchema {
  protected tableName = 'customers'

  public async up() {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.increments('id').primary().notNullable().unsigned()
      table.integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
      table.integer('address_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('addresses')
      table.string('number_document').notNullable()
      table.date('birthdate').notNullable()
      table.text('description')
      table.enum('gender', ['male', 'female']).notNullable()
      table.enum('blood_pressure', ['low', 'normal', 'high']).notNullable()
      table.boolean('have_allergy')
      table.boolean('have_diseases')
      table.boolean('have_treatment')
      table.string('gps')
      table.string('lastname').notNullable()
      table.string('name').notNullable()
      table.string('push_token')
      table.string('phone_number')
      table.boolean('phone_number_is_whatsapp')
      table.string('picture_profile')

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
