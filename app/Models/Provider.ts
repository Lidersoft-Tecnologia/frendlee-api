import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import users from './users'
import Clock from './Clock'
import Period from './Period'
import Address from './Address'
import Stuff from './Stuff'
import ProviderService from './ProviderService'

export default class Provider extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @hasOne(() => users)
  public users: HasOne<typeof users>

  @hasOne(() => Clock)
  public clock: HasOne<typeof Clock>

  @hasOne(() => Period)
  public period: HasOne<typeof Period>

  @hasOne(() => Address)
  public address: HasOne<typeof Address>

  @manyToMany(() => Stuff)
  public stuff: ManyToMany<typeof Stuff>

  @hasOne(() => ProviderService)
  public providerService: HasOne<typeof ProviderService>

  @column()
  public number_document: string

  @column()
  public birthdate: DateTime

  @column()
  public description: string

  @column()
  public formation?: string | undefined

  @column()
  public gender: string

  @column()
  public gps: string

  @column()
  public is_medical_provider: boolean

  @column()
  public lastname: string

  @column()
  public name: string

  @column()
  public stripe_id: string

  @column()
  public iban: string

  @column()
  public push_token: string

  @column()
  public phone_number: string

  @column()
  public phone_number_is_whatsapp: boolean

  @column()
  public picture_certification: string

  @column()
  public picture_profile: string

  @column()
  public picture_license: string

  @column()
  public picture_address: string

  @column()
  public clock_id: number

  @column()
  public periods_id: number

  @column()
  public address_id: number

  @column()
  public user_id: number

  @column()
  public provider_stuff_id: number

  @column()
  public provider_service_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
