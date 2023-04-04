import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Period from "App/Models/Period";

export default class PeriodsController {
  public async all({ response }: HttpContextContract) {
    try {
      const period = await Period.all();
      response.ok({
        message: `Periods successfully found.`,
        status: 200,
        data: period,
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

  public async find({ response, request }: HttpContextContract) {
    try {
      const periodId = request.param("periodId");
      const period = await Period.findOrFail(periodId);
      response.ok({
        message: `Period ID: ${period.id} successfully found.`,
        status: 200,
        data: period,
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

  public async create({ request, response, auth }: HttpContextContract) {
    try {
      if (auth.user?.account_type_id === 1) {
        const { name, enabled } = request.body();
        const period = await Period.create({
          enabled,
          name,
        });
        response.ok({
          message: `Period ID: ${period.id} created successfully.`,
          status: 200,
          data: period,
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

  public async update({ request, response, auth }: HttpContextContract) {
    try {
      if (auth.user?.account_type_id === 1) {
        const periodId = request.param("periodId");
        const { name, enabled } = request.body();
        const period = await Period.findOrFail(periodId);
        const responseObj = await period.merge({ name, enabled }).save();
        response.ok({
          message: `Period ID: ${responseObj.id} updated successfully.`,
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
}
