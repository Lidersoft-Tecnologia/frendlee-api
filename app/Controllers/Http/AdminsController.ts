import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Admin from "App/Models/Admin";

export default class AdminsController {
  public async index({ response }: HttpContextContract) {
    try {
      const address = await Admin.all();
      return address;
    } catch (error) {
      response.badRequest(error);
    }
  }

  private async profileAdmin(id: number, response: any) {
    const queryDatabase = await Database.from("admins as a")
      .where("a.id", id)
      .select("a.*")
      .join("users as u", "a.user_id", "u.id")
      .select(
        "u.id as user_id",
        "u.account_type_id",
        "u.status_id",
        "u.email",
        "u.email_verified"
      );

    if (queryDatabase.length > 0) {
      const item = queryDatabase[0];

      return {
        user: {
          id: item.user_id,
          email: item.email,
          email_verified: item.email_verified,
          account_type_id: item.account_type_id,
          status_id: item.status_id,
        },
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
    } else {
      return response.badRequest({
        message: "User not found",
        error: "User not found",
        status: 400,
        data: null,
      });
    }
  }

  public async find({ response, request, auth }: HttpContextContract) {
    try {
      const { adminId } = request.params();

      if (adminId && auth.user) {
        const { account_type_id, accountType, email, status_id } = auth.user;
        const userProfile = await this.profileAdmin(Number(adminId), response);

        return {
          id: adminId,
          account_type_id,
          accountType,
          status_id,
          email,
          ...userProfile,
        };
      } else {
        response.unauthorized({
          message: "Invalid or missing token.",
          error: new Error("Invalid or missing token."),
          status: 401,
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
