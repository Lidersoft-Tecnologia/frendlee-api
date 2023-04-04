import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Address from 'App/Models/Address'
import Customer from 'App/Models/Customer'
import Users from 'App/Models/users'

export default class RegisterCustomerSeeder extends BaseSeeder {
  public async run() {
    const user = await Users.create({
      account_type_id: 2,
      email: "testecustomer@teste.com",
      password: "123456",
      status_id: 1,
    })
    const address = await Address.create({
      city: "Valença",
      complement: "Teste de complemento",
      country: 'Brasil',
      district: 'Bairro',
      number: '148',
      postal_code: '27500000',
      state: 'Rio de Janeiro',
      street: 'Rua Teste da Esquina',
    })
    await Customer.create({
      address_id: address.id,
      //@ts-ignore
      birthdate: "2021-09-05 22:42:47.206+00",
      blood_pressure: "high",
      description: 'Uma boa descrição',
      gender: 'male',
      gps: 'Rua Da Esquina',
      have_allergy: false,
      have_diseases: false,
      have_treatment: true,
      lastname: 'Customer',
      name: 'Teste',
      number_document: '15945026',
      phone_number: '2499297546',
      phone_number_is_whatsapp: true,
      picture_profile: 'minha foto url',
      push_token: 'ExpoPushToken[SDSD544FDS8484fg5212]',
      user_id: user.id,
    })
  }
}
