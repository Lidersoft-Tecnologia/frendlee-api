import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Provider from "App/Models/Provider";
import ProvidersStuff from "App/Models/ProvidersStuff";
import Stuff from "App/Models/Stuff";

export default class ProviderStuffsController {
  public async find({ response, request }: HttpContextContract) {
    try {
      const providerId = request.param("providerId");
      if (providerId) {
        const queryBuilder = await Database.from("providers_stuffs as ps")
          .where("ps.provider_id", providerId)
          .select("ps.id", "ps.stuff_id", "ps.provider_id")
          .join("stuffs as s", "ps.stuff_id", "s.id")
          .select("s.name as stuff_name");
        response.ok({
          message: `ProviderStuff find successfully.`,
          status: 200,
          data: queryBuilder,
        });
      } else {
        response.internalServerError({
          message: "ProviderStuff id invalid, or non-existent..",
          error: "ProviderStuff id invalid, or non-existent.",
          status: 500,
          data: null,
        });
      }
    } catch (error) {
      response.internalServerError({
        message: "Error in find ProviderStuff.",
        error: error,
        status: 500,
        data: null,
      });
    }
  }

  public async all({ response }: HttpContextContract) {
    try {
      const queryBuilder = await Database.from("providers_stuffs as ps")
        .select("ps.id", "ps.stuff_id", "ps.provider_id")
        .join("stuffs as s", "ps.stuff_id", "s.id")
        .select("s.name as stuff_name");
      response.ok({
        message: `ProviderStuff list all successfully.`,
        status: 200,
        data: queryBuilder,
      });
    } catch (error) {
      response.internalServerError({
        message: "Error in list all ProviderStuff.",
        error: error,
        status: 500,
        data: null,
      });
    }
  }

  public async create({ response, request }: HttpContextContract) {
    try {
      const { provider_id, stuff_id } = request.body();
      if (stuff_id) {
        const responseObj = stuff_id.forEach(async (stuffId: number) => {
          const stuff = await Stuff.findOrFail(stuffId);
          await ProvidersStuff.create({
            provider_id,
            stuff_id: stuff.id,
          });
        });
        response.ok({
          message: `ProviderStuff ${responseObj.id} created successfully.`,
          status: 200,
          data: responseObj,
        });
      } else {
        response.internalServerError({
          message: "ProviderStuff id invalid, or non-existent..",
          error: "ProviderStuff id invalid, or non-existent.",
          status: 500,
          data: null,
        });
      }
    } catch (error) {
      response.internalServerError({
        message: "Error in create ProviderStuff.",
        error: error,
        status: 500,
        data: null,
      });
    }
  }

  public async update({ response, request }: HttpContextContract) {
    try {
      const providerStuffId = request.param("providerStuffId");
      const { provider_id, stuff_id } = request.body();
      if (stuff_id) {
        await Stuff.findOrFail(stuff_id);
        const providerStuff = await ProvidersStuff.findOrFail(providerStuffId);
        const checkExists = await ProvidersStuff.query().where(
          "provider_id",
          provider_id
        );
        if (checkExists.length > 0) {
          const providerStuffCheck = checkExists.filter(
            (i) => i.stuff_id === stuff_id
          );
          if (providerStuffCheck.length > 0) {
            response.internalServerError({
              message:
                "This stuff already exists registered with your profile.",
              error: "This stuff already exists registered with your profile.",
              status: 500,
              data: null,
            });
          } else {
            const responseObj = await providerStuff
              .merge({ provider_id, stuff_id })
              .save();
            response.ok({
              message: `ProviderStuff ${responseObj.id} updated successfully.`,
              status: 200,
              data: responseObj,
            });
          }
        } else {
          const responseObj = await providerStuff
            .merge({ provider_id, stuff_id })
            .save();
          response.ok({
            message: `ProviderStuff ${responseObj.id} updated successfully.`,
            status: 200,
            data: responseObj,
          });
        }
      } else {
        response.internalServerError({
          message: "StuffId id invalid, or non-existent.",
          error: "StuffId id invalid, or non-existent.",
          status: 500,
          data: null,
        });
      }
    } catch (error) {
      response.internalServerError({
        message: "Error in update ProviderStuff.",
        error: error,
        status: 500,
        data: null,
      });
    }
  }

  public updateStuffProvider = async({ response, request, auth }: HttpContextContract) => {
    try {
      if(auth.user?.account_type_id === 1 || auth.user?.account_type_id === 3){
        const providerId = request.param("providerId");
        const { stuffs } = request.body();
        await Provider.findOrFail(providerId);
        const queryProvider = await ProvidersStuff.query().where('provider_id', providerId);
        for(const query of queryProvider){
          const ps = await ProvidersStuff.findOrFail(query.id);
          await ps.delete();
        }
        for(const stuff_id of stuffs){
          await ProvidersStuff.create({
            provider_id: providerId,
            stuff_id
          });
        }
        response.ok({
          message: `ProviderStuff updated successfully.`,
          status: 200,
          data: null,
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
        message: "Error in update ProviderStuff.",
        error: error,
        status: 500,
        data: null,
      });
    }
  };
}
