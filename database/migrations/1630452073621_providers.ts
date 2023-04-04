import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Providers extends BaseSchema {
  protected tableName = 'providers'

  public async up() {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.increments('id').primary().notNullable().unsigned()
      table.integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
      table.integer('clock_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('clocks')
      table.integer('periods_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('periods')
      table.integer('address_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('addresses')
      table.string('number_document').notNullable()
      table.date('birthdate').notNullable()
      table.text('description')
      table.string('formation')
      table.enum('gender', ['male', 'female']).notNullable()
      table.string('gps')
      table.boolean('is_medical_provider').notNullable()
      table.string('lastname').notNullable()
      table.string('name').notNullable()
      table.string('push_token')
      table.string('phone_number')
      table.boolean('phone_number_is_whatsapp')
      table.string('picture_address')
      table.string('picture_certification')
      table.string('picture_profile')
      table.string('picture_license')
      table.string("iban").notNullable();
      table.string("stripe_id").notNullable().unique();
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
