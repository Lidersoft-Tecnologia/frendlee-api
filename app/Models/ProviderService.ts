import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Service from './Service'

export default class ProviderService extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public provider_id: number

  @column()
  public service_id: number

  @column()
  public value: number

  @hasOne(() => Service)
  public service: HasOne<typeof Service>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
