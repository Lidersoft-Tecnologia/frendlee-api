import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import AccountType from 'App/Models/AccountType'

export default class AccountTypeSeeder extends BaseSeeder {
  public async run() {
    await AccountType.createMany([
      {
        name: 'administrator',
      },
      {
        name: 'customer',
      },
      {
        name: 'provider',
      },
      {
        name: 'parent',
      }
    ])
  }
}
