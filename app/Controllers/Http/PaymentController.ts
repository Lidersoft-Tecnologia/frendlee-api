import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Env from "@ioc:Adonis/Core/Env";
import { schema } from "@ioc:Adonis/Core/Validator";
import { v4 as uuidv4 } from "uuid";
const SECRET_KEY = Env.get("SECRET_KEY");
import Stripe from "stripe";
import Payment from "App/Models/Payment";
import { add } from "date-fns";
import { DateTime } from "luxon";
import Provider from "App/Models/Provider";
import Database from "@ioc:Adonis/Lucid/Database";
import Appointment from "App/Models/Appointment";
const stripe = new Stripe(SECRET_KEY, {
  apiVersion: "2020-08-27",
});
export default class PaymentController {
  private schemePayment() {
    return schema.create({
      appointment_id: schema.number(),
      provider_id: schema.number(),
      customer_id: schema.number(),
      provider_stripe_id: schema.string(),
      total_value: schema.number(),
      provider_earn: schema.number.optional(),
      app_fee: schema.number.optional(),
      status_provider_earn: schema.enum.optional([
        "WAITING_SERVICE",
        "WAITING_DEAD_LINE",
        "CONFIRMED",
        "BLOCKED",
        "REQUEST_TRANSFER",
        "TRANSFERRED",
      ]),
      payed_at: schema.date(),
      available_at: schema.date.optional(),
      canceled_at: schema.date.optional(),
    });
  }

  public async paymentSheet({ request, response }: HttpContextContract) {
    try {
      const { value } = request.body();

      if (!value) {
        response.status(400).send({
          error: {
            message: "ERROR",
            error_message: "Invalid Value!",
          },
        });
      } else {
        const customer = await stripe.customers.create();
        const ephemeralKey = await stripe.ephemeralKeys.create(
          { customer: customer.id },
          { apiVersion: "2020-08-27" }
        );
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Number(value),
          currency: "usd",
          customer: customer.id,
        });

        return {
          paymentIntent: paymentIntent.client_secret,
          ephemeralKey: ephemeralKey.secret,
          customer: customer.id,
        };
      }
    } catch (error) {
      response.internalServerError({
        message: "An error has occurred.",
        error: error,
        status: 500,
        data: null,
      });
    }
  }

  public async find({ request, response }: HttpContextContract) {
    try {
      const { customer_id, provider_id, payment_id, appointment_id } =
        request.qs();
      if (customer_id) {
        const payment = await Payment.query()
          .where("customer_id", customer_id)
          .orWhereNull("customer_id");
        return payment;
      } else if (provider_id) {
        const payment = await Payment.query()
          .where("provider_id", provider_id)
          .orWhereNull("provider_id");
        return payment;
      } else if (payment_id) {
        const payment = await Payment.query()
          .where("id", payment_id)
          .orWhereNull("id");
        return payment;
      } else if (appointment_id) {
        const payment = await Payment.query()
          .where("appointment_id", appointment_id)
          .orWhereNull("appointment_id");
        return payment;
      } else {
        throw new Error("invalid params");
      }
    } catch (error) {
      response.internalServerError({
        message: "An error has occurred.",
        error: error,
        status: 500,
        data: null,
      });
    }
  }

  public async registerHistory({ request, response }: HttpContextContract) {
    try {
      const { appointmentId } = request.body();
      if (appointmentId) {
        const appointment = await Appointment.findOrFail(appointmentId);
        const provider = await Provider.findOrFail(appointment.provider_id);

        const provider_earn = 0.9 * appointment.value;
        const app_fee = 0.1 * appointment.value;
        const transaction_id = uuidv4();

        const newPayment = await Payment.create({
          appointment_id: appointment.id,
          provider_id: appointment.provider_id,
          customer_id: appointment.customer_id,
          provider_stripe_id: provider.stripe_id,
          total_value: appointment.value,
          provider_earn,
          app_fee,
          status_provider_earn: "WAITING_SERVICE",
          payed_at: appointment.payed_at,
          transaction_id,
        });

        console.log(newPayment);

        response.status(200).send({
          message: "Payments created successful!",
          status: 200,
          data: newPayment,
        });
      } else {
        response.badRequest({
          message: "appointmentId id invalid, or non-existent.",
          error: "appointmentId id invalid, or non-existent.",
          status: 400,
          data: null,
        });
      }
    } catch (error) {
      console.log(error);
      response.internalServerError({
        message: "Error in register history.",
        error: error,
        status: 500,
        data: null,
      });
    }
  }

  public async create({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate({
        schema: this.schemePayment(),
      });

      const provider_earn = 0.9 * payload.total_value;
      const app_fee = 0.1 * payload.total_value;
      const transaction_id = uuidv4();

      const newPayment = await Payment.create({
        appointment_id: payload.appointment_id,
        provider_id: payload.provider_id,
        customer_id: payload.customer_id,
        provider_stripe_id: payload.provider_stripe_id,
        total_value: payload.total_value,
        provider_earn,
        app_fee,
        status_provider_earn: "WAITING_SERVICE",
        payed_at: payload.payed_at,
        transaction_id,
      });

      response.status(200).send({
        message: "Payment created successful!",
        status: 200,
        data: newPayment,
      });
    } catch (error) {
      response.internalServerError({
        message: "An error has occurred.",
        error: error,
        status: 500,
        data: null,
      });
    }
  }

  // Lista o historico de pagamentos do Provider
  public async findHistory({ response, auth }: HttpContextContract) {
    try {
      const user = auth.user;
      if (user?.account_type_id === 3) {
        const provider = await Provider.findByOrFail("user_id", user?.id);
        const providerId = provider.id;
        const queryBuilder = await Database.from("payments as pay")
          .where("provider_id", providerId)
          .select("*")
          .join("customers as c", "pay.customer_id", "c.id")
          .select("c.name as customer_name", "c.lastname as customer_lastname");

        response.status(200).send({
          message:
            queryBuilder.length < 1 ? "History not found" : "History found",
          status: 200,
          data: queryBuilder,
        });
      } else {
        throw new Error("Your account is not provider type.");
      }
    } catch (error) {
      response.internalServerError({
        message: "An error has occurred.",
        error: error,
        status: 500,
        data: null,
      });
    }
  }

  // Alterar dados do Payments
  public async update({ response, auth, request }: HttpContextContract) {
    try {
      const user = auth.user;
      const id = request.param("paymentId");
      if (user?.account_type_id === 1) {
        const body = request.body();
        const payments = await Payment.findOrFail(id);
        await payments.merge(body).save();
      } else {
        throw new Error("Your account does not have privileges for this.");
      }
    } catch (error) {
      response.internalServerError({
        message: "An error has occurred.",
        error: error,
        status: 500,
        data: null,
      });
    }
  }

  // Alterar a data de liberação do pagamento
  public async updateAvailable({
    response,
    auth,
    request,
  }: HttpContextContract) {
    try {
      const user = auth.user;
      const appointmentId = request.param("appointmentId");
      if (
        user?.account_type_id === 1 ||
        user?.account_type_id === 2 ||
        user?.account_type_id === 3
      ) {
        if (appointmentId) {
          const payment = await Payment.findByOrFail(
            "appointment_id",
            appointmentId
          );
          const appointment = await Appointment.findOrFail(
            payment.appointment_id
          );
          if (appointment.status === "FINISHED") {
            const available_at = add(new Date(), {
              days: 15,
            });
            const responseObj = await payment
              .merge({
                available_at: DateTime.fromJSDate(available_at),
                status_provider_earn: "WAITING_FOR_DEADLINE",
              })
              .save();
            response.status(200).send({
              message: `Avaliable_at successfully changed, for the day: ${available_at}`,
              status: 200,
              data: responseObj,
            });
          } else {
            throw new Error(
              "You cannot change the payment release date without appointment confirmation."
            );
          }
        } else {
          throw new Error("Payment id invalid, or non-existent.");
        }
      } else {
        throw new Error("Your account does not have privileges for this.");
      }
    } catch (error) {
      console.log(error);
      response.internalServerError({
        message: "An error has occurred.",
        error: error,
        status: 500,
        data: null,
      });
    }
  }

  // "WAITING_SERVICE",
  // "WAITING_DEAD_LINE",
  // "CONFIRMED",
  // "BLOCKED",
  // "TRANSFERRED"

  private prepareBalance(payments: Payment[]) {
    const data = payments.map((payment) => {
      if (
        payment.available_at &&
        payment.status_provider_earn === "WAITING_FOR_DEADLINE"
      ) {
        //@ts-ignore
        const dateAvaliable = new Date(payment.available_at);
        const nowDate = new Date();
        if (nowDate > dateAvaliable) {
          payment.merge({ status_provider_earn: "CONFIRMED" }).save();
          payment.status_provider_earn = "CONFIRMED";
        }
      }
      return payment;
    });

    return data;
  }

  // Busca dados de saldo na carteira do Provider
  public async balanceProvider({
    response,
    auth,
    request,
  }: HttpContextContract) {
    try {
      if (
        auth.user?.account_type_id === 1 ||
        auth.user?.account_type_id === 3
      ) {
        const providerId = request.param("providerId");
        const payments = await Payment.query().where("provider_id", providerId);
        const object = this.prepareBalance(payments);

        const data = {
          totalBalance: 0,
          availableBalance: 0,
          waitingBalance: 0,
          blockedBalance: 0,
          waitingTransfer: 0,
          transferred: 0,
          history: [],
        };

        object.forEach((payment) => {
          data.totalBalance += payment.provider_earn;
          if (payment.status_provider_earn === "WAITING_SERVICE") {
            data.waitingBalance += payment.provider_earn;
          } else if (payment.status_provider_earn === "WAITING_DEADLINE") {
            data.waitingBalance += payment.provider_earn;
          } else if (payment.status_provider_earn === "CONFIRMED") {
            data.availableBalance += payment.provider_earn;
          } else if (payment.status_provider_earn === "BLOCKED") {
            data.blockedBalance += payment.provider_earn;
          } else if (payment.status_provider_earn === "REQUEST_TRANSFER") {
            data.waitingTransfer += payment.provider_earn;
          } else if (payment.status_provider_earn === "TRANSFERRED") {
            data.transferred += payment.provider_earn;
          }
          data.history.push(payment as never);
        });

        response.status(200).send({
          message: "Balance provider successful!",
          status: 200,
          data: data,
        });
      } else {
        response.forbidden({
          message: "Your account does not have privileges for this.",
          error: "Your account does not have privileges for this.",
          status: 403,
          data: null,
        });
      }
    } catch (error) {
      console.log(error);
      response.internalServerError({
        message: "An error has occurred.",
        error: error,
        status: 500,
        data: null,
      });
    }
  }

  public async requestWithdraw({ auth, response }: HttpContextContract) {
    try {
      if (auth.user?.account_type_id === 3) {
        const provider = await Provider.findByOrFail("user_id", auth.user.id);
        const payments = await Payment.query().where(
          "provider_id",
          provider.id
        );
        const history = this.prepareBalance(payments);
        const filterHistory = history.filter(
          (payment) => payment.status_provider_earn === "CONFIRMED"
        );
        if (filterHistory.length > 0) {
          filterHistory.map(async (payment) => {
            if (payment.status_provider_earn === "CONFIRMED") {
              payment.status_provider_earn = "REQUEST_TRANSFER";
              await payment
                .merge({ status_provider_earn: "REQUEST_TRANSFER" })
                .save();
            }
          });
          response.status(200).send({
            message: "Transfer successful.",
            status: 200,
            data: null,
          });
        } else {
          response.badRequest({
            message: "There is no balance available to withdraw.",
            error: "There is no balance available to withdraw.",
            status: 400,
            data: null,
          });
        }
      } else {
        response.forbidden({
          message: "Your account does not have privileges for this.",
          error: "Your account does not have privileges for this.",
          status: 403,
          data: null,
        });
      }
    } catch (error) {
      response.internalServerError({
        message: "An error has occurred.",
        error: error,
        status: 500,
        data: null,
      });
    }
  }

  public async confirmWithdraw({
    auth,
    response,
    request,
  }: HttpContextContract) {
    try {
      if (auth.user?.account_type_id === 1) {
        const providerId = request.param("providerId");
        const provider = await Provider.findOrFail(providerId);
        const payments = await Payment.query().where(
          "provider_id",
          provider.id
        );
        const history = this.prepareBalance(payments);
        const filterHistory = history.filter(
          (payment) => payment.status_provider_earn === "REQUEST_TRANSFER"
        );
        if (filterHistory.length > 0) {
          filterHistory.map(async (payment) => {
            if (payment.status_provider_earn === "REQUEST_TRANSFER") {
              payment.status_provider_earn = "TRANSFERRED";
              await payment
                .merge({ status_provider_earn: "TRANSFERRED" })
                .save();
            }
          });
          response.status(200).send({
            message: "Transfer confirmed successfully.",
            status: 200,
            data: null,
          });
        } else {
          response.badRequest({
            message: "There is no transfer request",
            error: "There is no transfer request",
            status: 400,
            data: null,
          });
        }
      } else {
        response.forbidden({
          message: "Your account does not have privileges for this.",
          error: "Your account does not have privileges for this.",
          status: 403,
          data: null,
        });
      }
    } catch (error) {
      response.internalServerError({
        message: "An error has occurred.",
        error: error,
        status: 500,
        data: null,
      });
    }
  }

  public async findRequestTransfer({ auth, response }: HttpContextContract) {
    try {
      if (auth.user?.account_type_id !== 1) {
        return response.forbidden({
          message: "Your account does not have privileges for this.",
          error: "Your account does not have privileges for this.",
          status: 403,
          data: null,
        });
      }

      const payments = await Payment.all();
      const history = this.prepareBalance(payments);
      const filterHistory = history.filter(
        (payment) => payment.status_provider_earn === "REQUEST_TRANSFER"
      );
      response.status(200).send({
        message: "Listing all transfer requests.",
        status: 200,
        data: filterHistory,
      });
    } catch (error) {
      response.internalServerError({
        message: "An error has occurred.",
        error: error,
        status: 500,
        data: null,
      });
    }
  }
}
