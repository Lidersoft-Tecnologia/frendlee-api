import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Admins extends BaseSchema {
  protected tableName = 'admins'

  public async up() {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').notNullable()
      table.string('name').notNullable()
      table.string('lastname').notNullable()
      table.string('contact').notNullable()
      table.string('description').notNullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
