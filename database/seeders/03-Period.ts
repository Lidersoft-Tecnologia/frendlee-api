import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Period from 'App/Models/Period'

export default class PeriodSeeder extends BaseSeeder {
  public async run () {
    await Period.createMany([
      {
        name: 'Everyday',
        enabled: true
      },
      {
        name: 'Holidays',
        enabled: true
      },
      {
        name: 'Weekdays',
        enabled: true
      },
      {
        name: 'Weekends',
        enabled: true
      },
    ])
  }
}
