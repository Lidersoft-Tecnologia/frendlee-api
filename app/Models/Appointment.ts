import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Appointment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public start_at: DateTime

  @column()
  public finish_at: DateTime

  @column()
  public observation: string

  @column()
  public status: string

  @column()
  public value: number

  @column()
  public address: string

  @column()
  public payed_at: DateTime

  @column()
  public started_at: DateTime

  @column()
  public finished_at: DateTime

  @column()
  public cancelled_at: DateTime

  @column()
  public customer_rating: boolean

  @column()
  public provider_rating: boolean

  @column()
  public provider_id: number

  @column()
  public customer_id: number

  @column()
  public provider_service_id: number

  @column()
  public address_of_customer: boolean

  @column()
  public duration: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
