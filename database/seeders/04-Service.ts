import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Service from 'App/Models/Service'

export default class ServiceSeeder extends BaseSeeder {
  public async run () {
    await Service.createMany([
      {
        name: 'I can provide medical support',
        enabled: true,
        max_value: 200,
        min_value: 100,
      },
      {
        name: 'I cannot provide medical support',
        enabled: true,
        max_value: 100,
        min_value: 50,
      }
    ])
  }
}
