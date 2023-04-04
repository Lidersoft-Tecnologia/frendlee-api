import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public city: string

  @column()
  public complement: string

  @column()
  public country: string

  @column()
  public district: string

  @column()
  public number: string

  @column()
  public postal_code: string

  @column()
  public state: string

  @column()
  public street: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
