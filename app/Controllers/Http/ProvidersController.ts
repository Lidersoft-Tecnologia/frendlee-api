import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Provider from "App/Models/Provider";
import users from "App/Models/users";

export default class ProvidersController {
  private prepareProviderResponse(item: any) {
    return {
      provider: {
        id: item.id,
        number_document: item.number_document,
        birthdate: item.birthdate,
        description: item.description,
        formation: item.formation,
        gender: item.gender,
        gps: item.gps,
        is_medical_provider: item.is_medical_provider,
        lastname: item.lastname,
        name: item.name,
        push_token: item.push_token,
        phone_number: item.phone_number,
        phone_number_is_whatsapp: item.phone_number_is_whatsapp,
        picture_address: item.picture_address,
        picture_certification: item.picture_certification,
        picture_profile: item.picture_profile,
        picture_license: item.picture_license,
        created_at: item.created_at,
        updated_at: item.updated_at,
        stripe_id: item.stripe_id,
        iban: item.iban,
        user: {
          id: item.user_id,
          email: item.email,
          email_verified: item.email_verified,
          account_type_id: item.account_type_id,
          status_id: item.status_id,
        },
        address: {
          id: item.address_id,
          city: item.city,
          complement: item.complement,
          country: item.country,
          district: item.district,
          number: item.number,
          postal_code: item.postal_code,
          state: item.state,
          street: item.street,
        },
        period: {
          id: item.period_id,
          name: item.period_name,
          enabled: item.period_enabled,
        },
        clock: {
          id: item.clock_id,
          name: item.clock_name,
          enabled: item.clock_enabled,
        },
      },
    };
  }

  public async index({ response, request, auth }: HttpContextContract) {
    try {
      const { id } = request.qs();
      if (id && auth.user) {
        const queryDatabase = await Database.from("providers as p")
          .where("p.id", id)
          .limit(1)
          .select("p.*")
          .join("users as u", "p.user_id", "u.id")
          .select(
            "u.id as user_id",
            "u.account_type_id",
            "u.status_id",
            "u.email",
            "u.email_verified"
          )
          .join("addresses as a", "p.address_id", "a.id")
          .select(
            "a.id as address_id",
            "a.city",
            "a.complement",
            "a.country",
            "a.district",
            "a.number",
            "a.postal_code",
            "a.state",
            "a.street"
          )
          .join("periods as pe", "p.periods_id", "pe.id")
          .select(
            "pe.name as period_name",
            "pe.enabled as period_enabled",
            "pe.id as period_id"
          )
          .join("clocks as c", "p.clock_id", "c.id")
          .select(
            "c.name as clock_name",
            "c.enabled as clock_enabled",
            "c.id as clock_id"
          );

        const response = this.prepareProviderResponse(queryDatabase[0]);

        return response;
      } else {
        const queryDatabase = await await Database.from("providers as p")
          .select("p.*")
          .join("users as u", "p.user_id", "u.id")
          .select(
            "u.id as user_id",
            "u.account_type_id",
            "u.status_id",
            "u.email",
            "u.email_verified"
          )
          .join("addresses as a", "p.address_id", "a.id")
          .select(
            "a.id as address_id",
            "a.city",
            "a.complement",
            "a.country",
            "a.district",
            "a.number",
            "a.postal_code",
            "a.state",
            "a.street"
          )
          .join("periods as pe", "p.periods_id", "pe.id")
          .select(
            "pe.name as period_name",
            "pe.enabled as period_enabled",
            "pe.id as period_id"
          )
          .join("clocks as c", "p.clock_id", "c.id")
          .select(
            "c.name as clock_name",
            "c.enabled as clock_enabled",
            "c.id as clock_id"
          );

        const response = queryDatabase.map((item) => {
          return this.prepareProviderResponse(item);
        });
        return response;
      }
    } catch (error) {
      response.badRequest(error);
    }
  }

  public async changeAccountType({
    response,
    request,
    auth,
  }: HttpContextContract) {
    const trx = await Database.transaction();
    try {
      if (auth.user) {
        const { users_id, account_type } = request.body();
        if (typeof account_type !== "number")
          throw new Error("Invalid Account Type");

        const updated_accounts: any = [];
        const list = Object.values(users_id);
        if (list.length) {
          for (const user_id of list) {
            const user = await users.findByOrFail("id", user_id);
            user.status_id = account_type;
            await user.useTransaction(trx).save();
            updated_accounts.push(user_id);
          }
        } else {
          const user = await users.findByOrFail("id", users_id);
          user.status_id = account_type;
          await user.useTransaction(trx).save();
          updated_accounts.push(users_id);
        }
        await trx.commit();
        response.send({
          updated_accounts: updated_accounts,
        });
      } else throw new Error();
    } catch (error) {
      await trx.rollback();
      response.status(400).send({
        error: {
          message: "",
          error_message: error,
        },
      });
    }
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      const { id } = request.params();
      const body = request.body();
      const provider = await Provider.findOrFail(id);
      await provider.merge(body).save();
      response.status(200).send({
        message: "Provider updated successful!",
        status: 200,
        data: provider,
      });
    } catch (error) {
      response.status(500).send({
        error: {
          message: "Provider not updated, error.",
          error_message: error,
        },
      });
    }
  }

  public async profile({ response, auth }: HttpContextContract) {
    try {
      if (auth.user?.account_type_id === 3) {
        //const provider = await Provider.findByOrFail("user_id", auth.user.id);
        const queryDatabase = await Database.from("providers as p")
          .where("p.id", 4)
          .select("p.*")
          .join("users as u", "p.user_id", "u.id")
          .select(
            "u.id as user_id",
            "u.account_type_id",
            "u.status_id",
            "u.email",
            "u.email_verified"
          )
          .join("addresses as a", "p.address_id", "a.id")
          .select(
            "a.id as address_id",
            "a.city",
            "a.complement",
            "a.country",
            "a.district",
            "a.number",
            "a.postal_code",
            "a.state",
            "a.street"
          )
          .join("periods as pe", "p.periods_id", "pe.id")
          .select("pe.name as period_name", "pe.enabled as period_enabled")
          .join("clocks as c", "p.clock_id", "c.id")
          .select("c.name as clock_name", "c.enabled as clock_enabled");

        const response = queryDatabase.map((item) => {
          return this.prepareProviderResponse(item);
        });
        return response;
      } else {
        response.forbidden({
          message: "Your account not provider.",
          error: "Your account not provider.",
          status: 403,
          data: null,
        });
      }
    } catch (error) {
      response.internalServerError({
        message: "Error in list all stuff.",
        error: error,
        status: 500,
        data: null,
      });
    }
  }
}
