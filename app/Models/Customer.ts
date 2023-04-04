import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import users from './users'
import Address from './Address'

export default class Customer extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @hasOne(() => users)
  public users: HasOne<typeof users>

  @hasOne(() => Address)
  public address: HasOne<typeof Address>

  @column()
  public number_document: string

  @column()
  public birthdate: DateTime

  @column()
  public description: string

  @column()
  public gender: string

  @column()
  public gps: string

  @column()
  public lastname: string

  @column()
  public name: string

  @column()
  public push_token: string

  @column()
  public have_allergy: boolean

  @column()
  public have_diseases: boolean

  @column()
  public have_treatment: boolean

  @column()
  public blood_pressure: string

  @column()
  public picture_profile: string

  @column()
  public phone_number_is_whatsapp: boolean

  @column()
  public phone_number: string

  @column()
  public address_id: number

  @column()
  public user_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
