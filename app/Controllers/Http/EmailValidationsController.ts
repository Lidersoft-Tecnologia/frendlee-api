import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class EmailValidationsController {
  public async index({ request }: HttpContextContract) {
    if (request.hasValidSignature()) {
      const { email } = request.params();
      return "Marking email as verified " + email;
    }

    return "Signature is missing or URL was tampered.";
  }
}
