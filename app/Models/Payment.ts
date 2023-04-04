import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public appointment_id: number

  @column()
  public provider_id: number

  @column()
  public provider_stripe_id: string

  @column()
  public customer_id: number

  @column()
  public total_value: number

  @column()
  public provider_earn: number

  @column()
  public app_fee: number

  @column()
  public status_provider_earn: String

  @column()
  public payed_at: DateTime

  @column()
  public available_at: DateTime

  @column()
  public canceled_at: DateTime

  @column()
  public transaction_id: String

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
