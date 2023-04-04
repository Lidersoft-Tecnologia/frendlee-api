import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ProvidersStuff extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public provider_id: number

  @column()
  public stuff_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
