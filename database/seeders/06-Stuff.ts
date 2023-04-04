import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Stuff from 'App/Models/Stuff'

export default class StuffSeeder extends BaseSeeder {
  public async run () {
    await Stuff.createMany([
      {
        name: 'Arts and culture',
        enabled: true
      },
      {
        name: 'Entertainment',
        enabled: true
      },
      {
        name: 'Sports',
        enabled: true
      },
      {
        name: 'Technology',
        enabled: true
      },
    ])
  }
}
