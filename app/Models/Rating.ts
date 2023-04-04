import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Rating extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public appointment_id: number

  @column()
  public customer_comment: string

  @column()
  public customer_rating: number

  @column()
  public customer_id: number

  @column()
  public provider_rating: number

  @column()
  public provider_id: number

  @column()
  public provider_comment: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
