import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Service from "App/Models/Service";

export default class ServicesController {
  public async find({ response, request }: HttpContextContract) {
    try {
      const serviceId = request.param("serviceId");
      if (serviceId) {
        const service = await Service.findOrFail(serviceId);
        response.ok({
          message: `Service ID: ${service.id} successfully found.`,
          status: 200,
          data: service,
        });
      } else {
        response.badRequest({
          message: "ServiceId id invalid, or non-existent.",
          error: "ServiceId id invalid, or non-existent.",
          status: 400,
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

  public async all({ response }: HttpContextContract) {
    try {
      const service = await Service.all();
      response.ok({
        message: `All Service successfully found.`,
        status: 200,
        data: service,
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

  public async create({ response, request, auth }: HttpContextContract) {
    try {
      if (auth.user?.account_type_id === 1) {
        const { name, enabled, max_value, min_value } = request.body();
        const service = await Service.create({
          name,
          enabled,
          max_value,
          min_value,
        });
        response.ok({
          message: `Service ID: ${service.id} created successfully.`,
          status: 200,
          data: service,
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
        message: "An error has occurred.",
        error: error,
        status: 500,
        data: null,
      });
    }
  }

  public async update({ response, request, auth }: HttpContextContract) {
    try {
      const serviceId = request.param("serviceId");
      if (auth.user?.account_type_id === 1) {
        const { name, enabled, max_value, min_value } = request.body();
        const service = await Service.findOrFail(serviceId);
        const responseObj = service
          .merge({ name, enabled, max_value, min_value })
          .save();
        response.ok({
          message: `Service ID: ${service.id} updated successfully.`,
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
        message: "An error has occurred.",
        error: error,
        status: 500,
        data: null,
      });
    }
  }

  public async remove({ request, response, auth }: HttpContextContract) {
    try {
      if (auth.user?.account_type_id === 1) {
        const serviceId = request.param("serviceId");
        const service = await Service.findOrFail(serviceId);
        await service.delete();
        response.ok({
          message: `Service ${service.id} successfully deleted.`,
          status: 200,
          data: null,
        });
      } else {
        response.forbidden({
          message: "Your account does not have privileges for this.",
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
}
