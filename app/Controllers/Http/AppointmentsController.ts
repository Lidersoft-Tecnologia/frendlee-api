import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Appointment from "App/Models/Appointment";
import { schema } from "@ioc:Adonis/Core/Validator";
import Provider from "App/Models/Provider";
import Database from "@ioc:Adonis/Lucid/Database";

export default class AppointmentsController {
  private constructObj(item: any) {
    return {
      id: item.id,
      start_at: item.start_at,
      finish_at: item.finish_at,
      observation: item.observation,
      status: item.status,
      value: item.value,
      address: item.address,
      payed_at: item.payed_at,
      started_at: item.started_at,
      finished_at: item.finished_at,
      cancelled_at: item.cancelled_at,
      customer_rating: item.customer_rating,
      provider_rating: item.provider_rating,
      duration: item.duration,
      address_of_customer: item.address_of_customer,
      provider_id: item.provider_id,
      customer_id: item.customer_id,
      provider_service_id: item.provider_service_id,
      created_at: item.created_at,
      updated_at: item.updated_at,
      provider: {
        number_document: item.number_document,
        iban: item.iban,
        name: item.provider_name,
        lastname: item.provider_lastname,
        description: item.description,
        formation: item.formation,
        is_medical_provider: item.is_medical_provider,
        picture_profile: item.provider_picture,
        push_token: item.provider_push,
        service: {
          name: item.service_name,
          value: item.service_value,
        },
      },
      customer: {
        name: item.customer_name,
        lastname: item.customer_lastname,
        picture_profile: item.customer_picture,
        push_token: item.customer_push,
        have_diseases: item.customer_have_diseases,
        have_treatment: item.customer_have_treatment,
        have_allergy: item.customer_have_allergy,
      },
    };
  }

  private schemeAppointments() {
    return schema.create({
      start_at: schema.date.optional(),
      finish_at: schema.date.optional(),
      observation: schema.string.optional(),
      status: schema.enum.optional([
        "OPENED",
        "CONFIRMED",
        "PAYED",
        "STARTED",
        "FINISHED",
        "CANCELLED",
      ] as const),
      value: schema.number.optional(),
      address: schema.string.optional(),
      payed_at: schema.date.optional(),
      started_at: schema.date.optional(),
      finished_at: schema.date.optional(),
      cancelled_at: schema.date.optional(),
      customer_rating: schema.boolean.optional(),
      provider_rating: schema.boolean.optional(),
      provider_id: schema.number.optional(),
      customer_id: schema.number.optional(),
      provider_service_id: schema.number.optional(),
      duration: schema.number.optional(),
      address_of_customer: schema.boolean.optional(),
    });
  }

  public async all({ response }: HttpContextContract) {
    try {
      const appointment = await Database.from("appointments as a")
        .select("a.*")
        .join("providers as p", "a.provider_id", "p.id")
        .select(
          "p.number_document",
          "p.iban",
          "p.description",
          "p.formation",
          "p.is_medical_provider",
          "p.name as provider_name",
          "p.lastname as provider_lastname",
          "p.picture_profile as provider_picture",
          "p.push_token as provider_push"
        )
        .join("provider_services as ps", "a.provider_service_id", "ps.id")
        .select("ps.service_id", "ps.value as service_value")
        .join("services as s", "ps.service_id", "s.id")
        .select("s.name as service_name")
        .join("customers as c", "a.customer_id", "c.id")
        .select(
          "c.name as customer_name",
          "c.lastname as customer_lastname",
          "c.picture_profile as customer_picture",
          "c.push_token as customer_push",
          "c.have_diseases as customer_have_diseases",
          "c.have_treatment as customer_have_treatment",
          "c.have_allergy as customer_have_allergy"
        );

      const responseObj = appointment.map((item) => this.constructObj(item));
      response.ok({
        message: "Appointments found!",
        status: 200,
        data: responseObj,
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

  public async filter({ request, response }: HttpContextContract) {
    try {
      const { provider_id, customer_id, status } = request.qs();
      if (provider_id) {
        const appointments = await Database.from("appointments as a")
          .where("a.provider_id", provider_id)
          .select("a.*")
          .join("providers as p", "a.provider_id", "p.id")
          .select(
            "p.number_document",
            "p.iban",
            "p.description",
            "p.formation",
            "p.is_medical_provider",
            "p.name as provider_name",
            "p.lastname as provider_lastname",
            "p.picture_profile as provider_picture",
            "p.push_token as provider_push"
          )
          .join("provider_services as ps", "a.provider_service_id", "ps.id")
          .select("ps.service_id", "ps.value as service_value")
          .join("services as s", "ps.service_id", "s.id")
          .select("s.name as service_name")
          .join("customers as c", "a.customer_id", "c.id")
          .select(
            "c.name as customer_name",
            "c.lastname as customer_lastname",
            "c.picture_profile as customer_picture",
            "c.push_token as customer_push",
            "c.have_diseases as customer_have_diseases",
            "c.have_treatment as customer_have_treatment",
            "c.have_allergy as customer_have_allergy"
          );

        const responseObj = appointments.map((item) => this.constructObj(item));
        response.ok({
          message: `Appointment's from provider ID: ${provider_id}, found.`,
          status: 200,
          data: responseObj,
        });
      } else if (customer_id) {
        const appointments = await Database.from("appointments as a")
          .where("a.customer_id", customer_id)
          .select("a.*")
          .join("providers as p", "a.provider_id", "p.id")
          .select(
            "p.number_document",
            "p.iban",
            "p.description",
            "p.formation",
            "p.is_medical_provider",
            "p.name as provider_name",
            "p.lastname as provider_lastname",
            "p.picture_profile as provider_picture",
            "p.push_token as provider_push"
          )
          .join("provider_services as ps", "a.provider_service_id", "ps.id")
          .select("ps.service_id", "ps.value as service_value")
          .join("services as s", "ps.service_id", "s.id")
          .select("s.name as service_name")
          .join("customers as c", "a.customer_id", "c.id")
          .select(
            "c.name as customer_name",
            "c.lastname as customer_lastname",
            "c.picture_profile as customer_picture",
            "c.push_token as customer_push",
            "c.have_diseases as customer_have_diseases",
            "c.have_treatment as customer_have_treatment",
            "c.have_allergy as customer_have_allergy"
          );

        const responseObj = appointments.map((item) => this.constructObj(item));
        response.ok({
          message: `Appointment's from customer ID: ${customer_id}, found.`,
          status: 200,
          data: responseObj,
        });
      } else if (status) {
        const appointments = await Database.from("appointments as a")
          .where("a.status", status)
          .select("a.*")
          .join("providers as p", "a.provider_id", "p.id")
          .select(
            "p.number_document",
            "p.iban",
            "p.description",
            "p.formation",
            "p.is_medical_provider",
            "p.name as provider_name",
            "p.lastname as provider_lastname",
            "p.picture_profile as provider_picture",
            "p.push_token as provider_push"
          )
          .join("provider_services as ps", "a.provider_service_id", "ps.id")
          .select("ps.service_id", "ps.value as service_value")
          .join("services as s", "ps.service_id", "s.id")
          .select("s.name as service_name")
          .join("customers as c", "a.customer_id", "c.id")
          .select(
            "c.name as customer_name",
            "c.lastname as customer_lastname",
            "c.picture_profile as customer_picture",
            "c.push_token as customer_push",
            "c.have_diseases as customer_have_diseases",
            "c.have_treatment as customer_have_treatment",
            "c.have_allergy as customer_have_allergy"
          );

        const responseObj = appointments.map((item) => this.constructObj(item));
        response.ok({
          message: `Appointment's from status: ${status}, found.`,
          status: 200,
          data: responseObj,
        });
      } else {
        response.badRequest({
          message: "Invalid params",
          error: "Invalid params",
          status: 400,
          data: null,
        });
      }
    } catch (error) {
      response.internalServerError({
        message: "An error has occurred",
        error: error,
        status: 500,
        data: null,
      });
    }
  }

  public async find({ request, response }: HttpContextContract) {
    try {
      const appointmentId = request.param("appointmentId");
      const appointment = await Database.from("appointments as a")
        .where("a.id", appointmentId)
        .select("a.*")
        .join("providers as p", "a.provider_id", "p.id")
        .select(
          "p.number_document",
          "p.iban",
          "p.number_document",
          "p.iban",
          "p.description",
          "p.formation",
          "p.is_medical_provider",
          "p.name as provider_name",
          "p.lastname as provider_lastname",
          "p.picture_profile as provider_picture",
          "p.push_token as provider_push"
        )
        .join("provider_services as ps", "a.provider_service_id", "ps.id")
        .select("ps.service_id", "ps.value as service_value")
        .join("services as s", "ps.service_id", "s.id")
        .select("s.name as service_name")
        .join("customers as c", "a.customer_id", "c.id")
        .select(
          "c.name as customer_name",
          "c.lastname as customer_lastname",
          "c.picture_profile as customer_picture",
          "c.push_token as customer_push",
          "c.have_diseases as customer_have_diseases",
          "c.have_treatment as customer_have_treatment",
          "c.have_allergy as customer_have_allergy"
        );

      const responseObj = this.constructObj(appointment[0]);

      response.ok({
        message: `Appointment's from ID: ${appointmentId}, found.`,
        status: 200,
        data: responseObj,
      });
    } catch (error) {
      response.internalServerError({
        message: "An error has occurred",
        error: error,
        status: 500,
        data: null,
      });
    }
  }

  public async updateStatus({ request, response, auth }: HttpContextContract) {
    try {
      if (
        auth.user?.account_type_id === 3 ||
        auth.user?.account_type_id === 3
      ) {
        const appointmentId = request.param("appointmentId");
        const { status } = request.body();
        const appointment = await Appointment.findOrFail(appointmentId);
        const responseObj = await appointment.merge({ status }).save();
        response.ok({
          message: `Appointment's status changed successfully.`,
          status: 200,
          data: responseObj,
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
      response.internalServerError({
        message: "An error has occurred",
        error: error,
        status: 500,
        data: null,
      });
    }
  }

  public async requests({ response, auth }: HttpContextContract) {
    try {
      if (auth.user?.account_type_id === 3) {
        const userId = auth.user.id;
        const provider = await Provider.findByOrFail("user_id", userId);
        const appointment = await Database.from("appointments as a")
          .where("a.provider_id", provider.id)
          .where("a.status", "OPENED")
          .select("a.*")
          .join("providers as p", "a.provider_id", "p.id")
          .select(
            "p.number_document",
            "p.iban",
            "p.description",
            "p.formation",
            "p.is_medical_provider",
            "p.name as provider_name",
            "p.lastname as provider_lastname",
            "p.picture_profile as provider_picture",
            "p.push_token as provider_push"
          )
          .join("provider_services as ps", "a.provider_service_id", "ps.id")
          .select("ps.service_id", "ps.value as service_value")
          .join("services as s", "ps.service_id", "s.id")
          .select("s.name as service_name")
          .join("customers as c", "a.customer_id", "c.id")
          .select(
            "c.name as customer_name",
            "c.lastname as customer_lastname",
            "c.picture_profile as customer_picture",
            "c.push_token as customer_push",
            "c.have_diseases as customer_have_diseases",
            "c.have_treatment as customer_have_treatment",
            "c.have_allergy as customer_have_allergy"
          );

        const responseObj = appointment.map((item) => this.constructObj(item));
        response.ok({
          message: `Appointments requests found.`,
          status: 200,
          data: responseObj,
        });
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
        message: "An error has occurred",
        error: error,
        status: 500,
        data: null,
      });
    }
  }

  public async create({ request, response, auth }: HttpContextContract) {
    try {
      if (
        auth.user?.account_type_id === 1 ||
        auth.user?.account_type_id === 2
      ) {
        const payload = await request.validate({
          schema: this.schemeAppointments(),
        });
        const newAppointment = await Appointment.create({
          observation: payload.observation,
          address: payload.address,
          customer_id: payload.customer_id,
          customer_rating: payload.customer_rating,
          finish_at: payload.finish_at,
          finished_at: payload.finished_at,
          payed_at: payload.payed_at,
          provider_id: payload.provider_id,
          provider_rating: payload.provider_rating,
          provider_service_id: payload.provider_service_id,
          start_at: payload.start_at,
          started_at: payload.started_at,
          status: payload.status,
          value: payload.value,
          duration: payload.duration,
          address_of_customer: payload.address_of_customer,
        });
        response.status(200).send({
          message: "Appointments created successful!",
          status: 200,
          data: newAppointment,
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
      response.status(500).send({
        error: {
          message: "Appointments not created, please, check infos.",
          error_message: error.message,
        },
      });
    }
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      const { id } = request.params();
      const body = request.body();
      const appointment = await Appointment.findOrFail(id);
      await appointment.merge(body).save();
      response.status(200).send({
        message: "Appointments updated successful!",
        status: 200,
        data: appointment,
      });
    } catch (error) {
      response.status(500).send({
        error: {
          message: "Appointments not found, or non-existent.",
          error_message: error,
        },
      });
    }
  }
}
