import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Providers extends BaseSchema {
  protected tableName = 'providers'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.string('stripe_id')
    })
  }

  public async down () {
    this.schema.dropTable('stripe_id')
  }
}
