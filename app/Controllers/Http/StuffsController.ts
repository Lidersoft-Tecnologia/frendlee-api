import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Stuff from "App/Models/Stuff";

export default class StuffsController {
  public async find({ response, request }: HttpContextContract) {
    try {
      const stuffId = request.param("stuffId");
      if (stuffId) {
        const stuffs = await Stuff.findOrFail(stuffId);
        response.ok({
          message: "Stuffs successfully found.",
          status: 200,
          data: stuffs,
        });
      } else {
        response.badRequest({
          message: "StuffId id invalid, or non-existent.",
          error: "StuffId id invalid, or non-existent.",
          status: 400,
          data: null,
        });
      }
    } catch (error) {
      response.internalServerError({
        message: "Error in find stuff.",
        error: error,
        status: 500,
        data: null,
      });
    }
  }

  public async all({ response }: HttpContextContract) {
    try {
      const stuffs = await Stuff.all();
      response.ok({
        message: "All Stuffs successfully found.",
        status: 200,
        data: stuffs,
      });
    } catch (error) {
      response.internalServerError({
        message: "Error in list all stuff.",
        error: error,
        status: 500,
        data: null,
      });
    }
  }

  public async create({ request, response, auth }: HttpContextContract) {
    try {
      if (auth.user?.account_type_id === 1) {
        const { name } = request.only(["name"]);
        const checkName = await Stuff.all();
        checkName.filter((stuff) => stuff.name === name);
        if (checkName.length > 0) {
          response.internalServerError({
            message: "That sutff name already exists.",
            error: "That sutff name already exists.",
            status: 500,
            data: null,
          });
        }
        const stuffs = await Stuff.create({
          enabled: true,
          name,
        });
        response.ok({
          message: `Stuff ${stuffs.id} create successfully.`,
          status: 200,
          data: stuffs,
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
        message: "Error in creating stuff.",
        error: error,
        status: 500,
        data: null,
      });
    }
  }

  public async update({ request, response, auth }: HttpContextContract) {
    try {
      if (auth.user?.account_type_id === 1) {
        const stuffId = request.param("stuffId");
        const { name } = request.body();
        const checkName = await Stuff.all();
        checkName.filter((stuff) => stuff.name === name);
        if (checkName.length > 0) {
          response.internalServerError({
            message: "That sutff name already exists.",
            error: "That sutff name already exists.",
            status: 500,
            data: null,
          });
        }
        const stuff = await Stuff.findOrFail(stuffId);
        const responseObj = await stuff.merge({ name }).save();
        response.ok({
          message: `Stuff ${responseObj.id} updated successfully.`,
          status: 200,
          data: responseObj,
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
        message: "Error in updating stuff.",
        error: error,
        status: 500,
        data: null,
      });
    }
  }

  public async remove({ request, response, auth }: HttpContextContract) {
    try {
      if (auth.user?.account_type_id === 1) {
        const stuffId = request.param("stuffId");
        const stuff = await Stuff.findOrFail(stuffId);
        await stuff.delete();
        response.ok({
          message: `Stuff ${stuff.id} successfully deleted.`,
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
        message: "Error in removing stuff.",
        error: error,
        status: 500,
        data: null,
      });
    }
  }
}
