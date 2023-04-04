import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Env from "@ioc:Adonis/Core/Env";

const SECRET_KEY = Env.get("SECRET_KEY");
import Stripe from "stripe";
import Provider from "App/Models/Provider";
const stripe = new Stripe(SECRET_KEY, {
  apiVersion: "2020-08-27",
});

export default class StripeAccountsController {
  public async create({ request, response }: HttpContextContract) {
    try {
      const { email, provider_id } = request.body();
      const account = await stripe.accounts.create({
        type: "standard",
        country: "NL",
        email,
      });
      const provider = await Provider.findOrFail(Number(provider_id));
      provider.merge({ stripe_id: account.id });
      await provider.save();
      response.status(200).send({
        data: {
          message: "Account stripe created",
          data: account,
          status: 200,
        },
      });
    } catch (error) {
      response.badRequest(error);
    }
  }

  public async find({ request, response }: HttpContextContract) {
    try {
      const { provider_id, stripeid } = request.qs();
      if (provider_id) {
        const provider = await Provider.findOrFail(Number(provider_id));
        if (provider) {
          const account = await stripe.accounts.retrieve(provider.stripe_id);
          response.status(200).send({
            data: {
              message: "Account found successfully",
              status: 200,
              data: account,
            },
          });
        } else {
          throw new Error("Invalid provider_id or not found");
        }
      } else if (stripeid) {
        const account = await stripe.accounts.retrieve(stripeid);
        response.status(200).send({
          data: {
            message: "Account found successfully",
            status: 200,
            data: account,
          },
        });
      }
    } catch (error) {
      response.badRequest(400);
    }
  }
}
