import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Provider from "App/Models/Provider";
import ProviderService from "App/Models/ProviderService";
import Service from "App/Models/Service";

export default class ProviderServicesController {
  public async find({ response, request }: HttpContextContract) {
    try {
      const providerId = request.param("providerId");
      if (providerId) {
        const queryBuilder = await Database.from("providers as p")
          .where("p.id", providerId)
          .join("provider_services as ps", "p.id", "ps.provider_id")
          .select(
            "ps.id",
            "ps.provider_id",
            "ps.service_id",
            "ps.value",
            "ps.created_at",
            "ps.updated_at"
          )
          .join("services as s", "ps.service_id", "s.id")
          .select("s.name");
        response.ok({
          message: `ProviderService find successfully.`,
          status: 200,
          data: queryBuilder,
        });
      } else {
        response.internalServerError({
          message: "ProviderService id invalid, or non-existent.",
          error: "ProviderService id invalid, or non-existent.",
          status: 500,
          data: null,
        });
      }
    } catch (error) {
      response.internalServerError({
        message: "Error in find ProviderServices",
        error: error,
        status: 500,
        data: null,
      });
    }
  }

  public async all({ response }: HttpContextContract) {
    try {
      const queryBuilder = await Database.from("providers as p")
        .join("provider_services as ps", "p.id", "ps.provider_id")
        .select(
          "ps.id",
          "ps.provider_id",
          "ps.service_id",
          "ps.value",
          "ps.created_at",
          "ps.updated_at"
        )
        .join("services as s", "ps.service_id", "s.id")
        .select("s.name");
      response.ok({
        message: `ProviderService find successfully.`,
        status: 200,
        data: queryBuilder,
      });
    } catch (error) {
      response.internalServerError({
        message: "Error in list all ProviderServices",
        error: error,
        status: 500,
        data: null,
      });
    }
  }

  public async create({ response, request, auth }: HttpContextContract) {
    try {
      if (
        auth.user?.account_type_id === 1 ||
        auth.user?.account_type_id === 3
      ) {
        const { provider_id, service_id, value } = request.body();
        await Provider.findOrFail(provider_id);
        const service = await Service.findOrFail(service_id);
        if (service.min_value <= value && service.max_value >= value) {
          const responseObj = await ProviderService.create({
            provider_id,
            service_id,
            value,
          });
          response.ok({
            message: `ProviderService created successfully.`,
            status: 200,
            data: responseObj,
          });
        } else {
          response.internalServerError({
            message:
              "Value not compatible with the max and min value of the service.",
            error:
              "Value not compatible with the max and min value of the service.",
            status: 500,
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
        message: "Error in creating ProviderService.",
        error: error,
        status: 500,
        data: null,
      });
    }
  }

  public async update({ request, response, auth }: HttpContextContract) {
    try {
      if (
        auth.user?.account_type_id === 1 ||
        auth.user?.account_type_id === 3
      ) {
        const providerServiceId = request.param("providerServiceId");
        const { service_id, value } = request.body();
        const providerService = await ProviderService.findOrFail(
          providerServiceId
        );
        await Service.findOrFail(service_id);
        const responseObj = await providerService
          .merge({ service_id, value })
          .save();
        response.ok({
          message: `ProviderService updated successfully.`,
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
      console.log(error)
      response.internalServerError({
        message: "Error in update ProviderService.",
        error: error,
        status: 500,
        data: null,
      });
    }
  }
}
