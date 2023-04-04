import Application from "@ioc:Adonis/Core/Application";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import users from "App/Models/users";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Address from "App/Models/Address";
import Database from "@ioc:Adonis/Lucid/Database";
import Provider from "App/Models/Provider";
import Customer from "App/Models/Customer";
import ProvidersStuff from "App/Models/ProvidersStuff";
import ProviderService from "App/Models/ProviderService";
import Admin from "App/Models/Admin";
import Env from "@ioc:Adonis/Core/Env";
const SECRET_KEY = Env.get("SECRET_KEY");
import Stripe from "stripe";
import { OpaqueTokenContract } from "@ioc:Adonis/Addons/Auth";
import Mail from "@ioc:Adonis/Addons/Mail";
import { v4 as uuidv4 } from "uuid";
const stripe = new Stripe(SECRET_KEY, {
  apiVersion: "2020-08-27",
});
//import Route from '@ioc:Adonis/Core/Route'

export default class AuthController {
  private schemeProvider() {
    return schema.create({
      email: schema.string({ trim: true }, [rules.email()]),
      password: schema.string({}, [rules.minLength(6)]),
      status_id: schema.number(),
      birthdate: schema.date(),
      description: schema.string(),
      formation: schema.string.optional(),
      gender: schema.enum(["male", "female"]),
      gps: schema.string.optional(),
      is_medical_provider: schema.boolean(),
      lastname: schema.string(),
      name: schema.string({ trim: true }),
      push_token: schema.string(),
      phone_number: schema.string({}, [
        rules.mobile({ locale: ["nl-NL", "pt-BR", "en-US"] }),
        rules.unique({ table: "providers", column: "phone_number" }),
      ]),
      phone_number_is_whatsapp: schema.boolean(),
      number_document: schema.string(),
      clock_id: schema.number(),
      periods_id: schema.number(),
      stuffs_id: schema.array().members(schema.number()),
      picture_profile: schema.string(),
      picture_address: schema.string(),
      picture_certification: schema.string(),
      picture_license: schema.string(),
      iban: schema.string(),
      services: schema
        .array()
        .members(
          schema
            .object()
            .members({ id: schema.number(), value: schema.number() })
        ),
      address: schema.object().members({
        city: schema.string(),
        complement: schema.string.optional(),
        country: schema.string(),
        district: schema.string(),
        number: schema.string(),
        postal_code: schema.string(),
        street: schema.string(),
        state: schema.string(),
      }),
    });
  }

  private schemeCustomer() {
    return schema.create({
      user: schema.object().members({
        email: schema.string({ trim: true }, [rules.email()]),
        password: schema.string({}, [rules.minLength(8)]),
        status_id: schema.number(),
      }),
      birthdate: schema.date(),
      gender: schema.enum(["male", "female"]),
      gps: schema.string.optional(),
      lastname: schema.string(),
      name: schema.string({ trim: true }),
      phone_number: schema.string({}, [
        rules.mobile({ locale: ["nl-NL", "pt-BR", "en-US"] }),
        rules.unique({ table: "providers", column: "phone_number" }),
      ]),
      phone_number_is_whatsapp: schema.boolean(),
      blood_pressure: schema.enum(["low", "normal", "high"]),
      have_allergy: schema.boolean(),
      have_diseases: schema.boolean(),
      have_treatment: schema.boolean(),
      number_document: schema.string(),
      address: schema.object().members({
        city: schema.string(),
        complement: schema.string.optional(),
        country: schema.string(),
        district: schema.string(),
        number: schema.string(),
        postal_code: schema.string(),
        street: schema.string(),
        state: schema.string(),
      }),
    });
  }

  private schemeAdmin() {
    return schema.create({
      user: schema.object().members({
        email: schema.string({ trim: true }, [rules.email()]),
        password: schema.string({}, [rules.minLength(8)]),
        status_id: schema.number(),
      }),
      name: schema.string(),
      lastname: schema.string(),
      contact: schema.string(),
      description: schema.string.optional(),
    });
  }

  private prepareResponse(item: any, token: OpaqueTokenContract<users>) {
    const base = {
      user: {
        id: item.user_id,
        email: item.email,
        email_verified: item.email_verified,
        account_type_id: item.account_type_id,
        status_id: item.status_id,
      },
      token: token.token,
    };

    const aditional = {
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
      address: {
        city: item.city,
        complement: item.complement,
        country: item.country,
        district: item.district,
        number: item.number,
        postal_code: item.postal_code,
        state: item.state,
        street: item.street,
      },
    };

    // Admin
    if (item.account_type_id === 1) {
      return {
        ...base,
        admin: {
          id: item.id,
          name: item.name,
          lastname: item.lastname,
          description: item.description,
          contact: item.contact,
          created_at: item.created_at,
          updated_at: item.updated_at,
        },
      };
    }

    // Customer
    if (item.account_type_id === 2) return { ...base, ...aditional };

    // Provider
    return {
      ...base,
      ...aditional,
      stripe_id: item.stripe_id,
      iban: item.iban,

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
    };
  }

  private async profileProvider(
    id: number,
    token: OpaqueTokenContract<users>,
    response: any
  ) {
    console.log("id: ", id);
    const queryDatabase = await Database.from("users as u")
      .where("u.id", id)
      .select(
        "u.id as user_id",
        "u.account_type_id",
        "u.status_id",
        "u.email",
        "u.email_verified"
      )
      .where("user_id", id)
      .join("providers as p", "user_id", "p.user_id")
      .select("p.*")
      .join("addresses as a", "a.id", "p.address_id")
      .select(
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
        "p.id as period_id"
      )
      .join("clocks as c", "p.clock_id", "c.id")
      .select(
        "c.name as clock_name",
        "c.enabled as clock_enabled",
        "c.id as clock_id"
      );

    console.log(queryDatabase);
    if (queryDatabase.length > 0) {
      return {
        provider: this.prepareResponse(queryDatabase[0], token),
      };
    } else {
      return response.badRequest("Invalid credentials");
    }
  }

  private async profileCustomer(
    id: number,
    token: OpaqueTokenContract<users>,
    response: any
  ) {
    const queryDatabase = await Database.from("users as u")
      .where("u.id", id)
      .select(
        "u.id as user_id",
        "u.account_type_id",
        "u.status_id",
        "u.email",
        "u.email_verified"
      )
      .where("user_id", id)
      .join("customers as c", "user_id", "c.user_id")
      .select("c.*")
      .join("addresses as a", "a.id", "c.address_id")
      .select(
        "a.city",
        "a.complement",
        "a.country",
        "a.district",
        "a.number",
        "a.postal_code",
        "a.state",
        "a.street"
      );

    if (queryDatabase.length > 0) {
      return {
        customer: this.prepareResponse(queryDatabase[0], token),
      };
    } else {
      return response.badRequest("Auth user error aaa");
    }
  }

  private async profileAdmin(
    id: number,
    token: OpaqueTokenContract<users>,
    response: any
  ) {
    const queryDatabase = await Database.from("users as u")
      .where("u.id", id)
      .select(
        "u.id as user_id",
        "u.account_type_id",
        "u.status_id",
        "u.email",
        "u.email_verified"
      )
      .join("admins as a", "u.id", "a.user_id")
      .select("a.*");
      // .select("*");


    if (queryDatabase.length > 0) {
      return this.prepareResponse(queryDatabase[0], token);
    } else {
      return response.badRequest("Auth user error");
    }
  }

  public async loginProvider({ request, response, auth }: HttpContextContract) {
    const email = request.input("email");
    const password = request.input("password");

    try {
      const token = await auth.use("api").attempt(email, password);
      if (auth.user) {
        const { id } = auth.user;
        console.log(id);
        const userProfile: any = await this.profileProvider(
          id,
          token,
          response
        );
        console.log(userProfile);
        if (userProfile) {
          return userProfile;
        } else {
          throw new Error();
        }
      } else {
        throw new Error("Invalid credentials");
      }
    } catch {
      return response.badRequest("Invalid credentials");
    }
  }

  public async loginCustomer({ request, response, auth }: HttpContextContract) {
    const email = request.input("email");
    const password = request.input("password");

    try {
      const token = await auth.use("api").attempt(email, password);
      if (auth.user) {
        const { id } = auth.user;
        const userProfile: any = await this.profileCustomer(
          id,
          token,
          response
        );

        if (userProfile) return userProfile;
        else throw new Error("Auth user error");
      } else {
        throw new Error("Auth user error");
      }
    } catch {
      return response.badRequest("Invalid credentials");
    }
  }

  public async loginAdmin({ request, response, auth }: HttpContextContract) {
    const email = request.input("email");
    const password = request.input("password");

    try {
      const token = await auth.use("api").attempt(email, password);
      if (auth.user) {
        const { account_type_id, accountType, id, email, status_id } =
          auth.user;

        const userProfile = await this.profileAdmin(id, token, response);

        return {
          account_type_id,
          accountType,
          status_id,
          id,
          email,
          token,
          ...userProfile,
        };
      }
    } catch (error) {
      response.badRequest("Invalid credentials");
    }
  }

  public async registerProvider({ request, response }: HttpContextContract) {
    const trx = await Database.transaction();
    try {
      const payload = await request.validate({ schema: this.schemeProvider() });
      const user = await users.create(
        {
          email: payload.email,
          password: payload.password,
          account_type_id: 3,
          status_id: payload.status_id,
        },
        { client: trx }
      );

      const address = await Address.create(
        {
          city: payload.address.city,
          complement: payload.address.complement,
          country: payload.address.country,
          district: payload.address.district,
          number: payload.address.number,
          postal_code: payload.address.postal_code,
          state: payload.address.state,
          street: payload.address.street,
        },
        { client: trx }
      );

      const responseAccountStripe = await stripe.customers.create({
        name: payload.name + " " + payload.lastname,
        phone: payload.phone_number,
        email: payload.email,
        address: {
          city: payload.address.city,
          country: payload.address.country,
          postal_code: payload.address.postal_code,
          state: payload.address.state,
          line1: payload.address.street,
        },
      });

      const provider = await Provider.create(
        {
          birthdate: payload.birthdate,
          description: payload.description,
          formation: payload.formation,
          gender: payload.gender,
          gps: payload.gps,
          is_medical_provider: payload.is_medical_provider,
          lastname: payload.lastname,
          name: payload.name,
          push_token: payload.push_token,
          phone_number: payload.phone_number,
          phone_number_is_whatsapp: payload.phone_number_is_whatsapp,
          number_document: payload.number_document,
          clock_id: payload.clock_id,
          periods_id: payload.periods_id,
          address_id: address.id,
          user_id: user.id,
          stripe_id: responseAccountStripe.id,
          iban: payload.iban,
          picture_profile: payload.picture_profile,
          picture_address: payload.picture_address,
          picture_certification: payload.picture_certification,
          picture_license: payload.picture_license,
        },
        { client: trx }
      );

      const arrayStuffs: Array<number> = payload.stuffs_id;
      for (const stuff_id of arrayStuffs) {
        await ProvidersStuff.create(
          {
            provider_id: provider.id,
            stuff_id: stuff_id,
          },
          { client: trx }
        );
      }

      const services: Array<{ id: number; value: number }> = payload.services;
      for (const service of services) {
        await ProviderService.create(
          {
            provider_id: provider.id,
            service_id: service.id,
            value: service.value,
          },
          { client: trx }
        );
      }

      await trx.commit();
      await this.sendEmailVerify(payload.email, payload.name, user.id);
      return provider;
    } catch (error) {
      await trx.rollback();
      return response.badRequest(error);
    }
  }

  public async registerCustomer({ request, response }: HttpContextContract) {
    const trx = await Database.transaction();
    try {
      const payload = await request.validate({ schema: this.schemeCustomer() });
      const user = await users.create(
        {
          email: payload.user.email,
          password: payload.user.password,
          account_type_id: 2,
          status_id: payload.user.status_id,
        },
        { client: trx }
      );

      const address = await Address.create(
        {
          city: payload.address.city,
          complement: payload.address.complement,
          country: payload.address.country,
          district: payload.address.district,
          number: payload.address.number,
          postal_code: payload.address.postal_code,
          state: payload.address.state,
          street: payload.address.street,
        },
        { client: trx }
      );

      const provider = await Customer.create(
        {
          blood_pressure: payload.blood_pressure,
          have_allergy: payload.have_allergy,
          have_diseases: payload.have_diseases,
          have_treatment: payload.have_treatment,
          birthdate: payload.birthdate,
          gender: payload.gender,
          gps: payload.gps,
          lastname: payload.lastname,
          name: payload.name,
          phone_number: payload.phone_number,
          phone_number_is_whatsapp: payload.phone_number_is_whatsapp,
          number_document: payload.number_document,
          address_id: address.id,
          user_id: user.id,
        },
        { client: trx }
      );

      await trx.commit();
      await this.sendEmailVerify(payload.user.email, payload.name, user.id);
      return provider;
    } catch (error) {
      await trx.rollback();
      return response.badRequest(error);
    }
  }

  public async registerAdmin({ request, response }: HttpContextContract) {
    const trx = await Database.transaction();
    try {
      const payload = await request.validate({ schema: this.schemeAdmin() });
      const user = await users.create(
        {
          email: payload.user.email,
          password: payload.user.password,
          account_type_id: 1,
          status_id: 1,
        },
        { client: trx }
      );

      const adm = await Admin.create(
        {
          name: payload.name,
          lastname: payload.lastname,
          contact: payload.contact,
          description: payload.description,
          user_id: user.id,
        },
        { client: trx }
      );

      await trx.commit();
      return adm;
    } catch (error) {
      await trx.rollback();
      return response.badRequest(error);
    }
  }

  public async verifyEmail({ request, response }: HttpContextContract) {
    try {
      const verificationCode = request.param("verificationCode");
      if (verificationCode) {
        const user = await users.findBy("verification_code", verificationCode);
        if (user) {
          await user
            .merge({
              email_verified: true,
            })
            .save();
          response.ok({
            message: `Email ${user.email} verified successfully.`,
            status: 200,
            data: null,
          });
        } else {
          response.badRequest({
            message: "verificationCode invalid.",
            error: "verificationCode invalid.",
            status: 400,
            data: null,
          });
        }
      } else {
        response.badRequest({
          message: "verificationCode not exists or invalid.",
          error: "verificationCode not exists or invalid.",
          status: 400,
          data: null,
        });
      }
    } catch (error) {
      response.internalServerError({
        message: "An error has occurred.",
        error,
        status: 500,
        data: null,
      });
    }
  }

  private async sendEmailVerify(email: string, name: string, id: number) {
    try {
      const code = uuidv4();
      const user = await users.findOrFail(id);
      await user
        .merge({
          verification_code: code,
        })
        .save();

      await Mail.send((message) => {
        message
          .from("csfrendlee@gmail.com")
          .to(email)
          .embed(
            Application.publicPath("frendlee-logo.png"),
            "id-frendlee-logo"
          )
          .subject("Welcome Frendlee!")
          .htmlView("emails/emailVerify", {
            user: { fullName: name },
            url: `http://clientesmart.com.br/auth/register/verifyemail/${code}`,
          });
      });
    } catch (error) {
      console.log(error);
    }
  }
}
