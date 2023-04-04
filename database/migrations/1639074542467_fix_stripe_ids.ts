import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Payments extends BaseSchema {
  protected tableName = 'payments'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.string('provider_stripe_id').notNullable().unsigned().alter();
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('provider_stripe_id')
    })
  }
}
