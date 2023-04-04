import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Address from "App/Models/Address";
import Provider from "App/Models/Provider";
import ProviderService from "App/Models/ProviderService";
import ProvidersStuff from "App/Models/ProvidersStuff";
import Users from "App/Models/users";

export default class RegisterProviderSeeder extends BaseSeeder {
  public async run() {
    const user = await Users.create({
      email: "teste@teste.com",
      password: "123456",
      account_type_id: 3,
      status_id: 1,
    });

    const address = await Address.create({
      city: "Juiz de Fora",
      complement: "Casa de esquina",
      country: "Brasil",
      district: "São Pedro",
      number: "710",
      postal_code: "36036333",
      state: "MG",
      street: "Rua Jose Pedro",
    });

    const provider = await Provider.create({
      //@ts-ignore
      birthdate: "2021-09-05 22:42:47.206+00",
      description: "Sem descrição",
      formation: "Medico",
      gender: "male",
      gps: "Rua Jose Pedro",
      is_medical_provider: true,
      lastname: "Teste",
      name: "Conta de",
      push_token: "ExpoPushToken[SDSD544FDS8484fg5212]",
      phone_number: "32999999999",
      phone_number_is_whatsapp: true,
      number_document: "01020304",
      picture_address: "ODSKOSDKOKDSOKDSOK",
      picture_certification: "SDIJDIJSIJDJSD",
      picture_profile: "SDJSDIJIDJISJIDJ",
      picture_license: "SDOKJOSDKOSDKOKSOD",
      clock_id: 1,
      periods_id: 1,
      address_id: address.id,
      user_id: user.id,
    });

    const arrayStuffs: Array<number> = [1, 2];
    for (const stuff_id of arrayStuffs) {
      await ProvidersStuff.create({
        provider_id: provider.id,
        stuff_id: stuff_id,
      });
    }

    const services: Array<{ id: number; value: number }> = [
      { id: 1, value: 100 },
      { id: 2, value: 50 },
    ];
    for (const service of services) {
      await ProviderService.create({
        provider_id: provider.id,
        service_id: service.id,
        value: service.value,
      });
    }
  }
}
