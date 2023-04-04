import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasOne,
  HasOne,
} from '@ioc:Adonis/Lucid/Orm'
import AccountType from './AccountType'
import Status from './Status'
import Provider from './Provider'

export default class users extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public email_verified: boolean

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column()
  public account_type_id: number

  @column()
  public verification_code: string

  @column()
  public status_id: number

  @hasOne(() => AccountType)
  public accountType: HasOne<typeof AccountType>

  @hasOne(() => Provider)
  public provider: HasOne<typeof Provider>

  @hasOne(() => Status)
  public status: HasOne<typeof Status>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (users: users) {
    if (users.$dirty.password) {
      users.password = await Hash.make(users.password)
    }
  }
}
