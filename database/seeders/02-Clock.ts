import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Clock from 'App/Models/Clock'

export default class ClockSeeder extends BaseSeeder {
  public async run() {
    await Clock.createMany([
      {
        name: '24 hours',
        enabled: true
      },
      {
        name: 'Business hours - 8AM at 6PM',
        enabled: true
      },
      {
        name: 'Extended business hours - 6AM at 6PM',
        enabled: true
      }
    ])
  }
}
