import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Clock from "App/Models/Clock";

export default class ClocksController {
  public async all({ response }: HttpContextContract) {
    try {
      const clocks = await Clock.all();
      response.ok({
        message: `Clocks successfully found.`,
        status: 200,
        data: clocks,
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
      const clockId = request.param("clockId");
      const clocks = await Clock.findOrFail(clockId);
      response.ok({
        message: `Clock ID: ${clocks.id} successfully found.`,
        status: 200,
        data: clocks,
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
        const clocks = await Clock.create({
          enabled,
          name,
        });
        response.ok({
          message: `Clock ID: ${clocks.id} created successfully.`,
          status: 200,
          data: clocks,
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
        const clockId = request.param("clockId");
        const { name, enabled } = request.body();
        const clock = await Clock.findOrFail(clockId);
        const responseObj = await clock.merge({ name, enabled }).save();
        response.ok({
          message: `Clock ID: ${responseObj.id} updated successfully.`,
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
