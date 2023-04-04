import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Appointment from "App/Models/Appointment";
import Rating from "App/Models/Rating";

export default class RatingsController {
  public async index({ response }: HttpContextContract) {
    try {
      const ratings = Rating.all();
      return ratings;
    } catch (error) {
      response.badRequest(error);
    }
  }

  public async find({ request, response }: HttpContextContract) {
    try {
      const { customer_id, provider_id, rating_id, appointment_id } =
        request.qs();
      if (customer_id) {
        const rating = await Rating.query()
          .where("customer_id", customer_id)
          .orWhereNull("customer_id");
        return rating;
      } else if (provider_id) {
        const rating = await Rating.query()
          .where("provider_id", provider_id)
          .orWhereNull("provider_id");
        return rating;
      } else if (rating_id) {
        const rating = await Rating.query()
          .where("rating_id", rating_id)
          .orWhereNull("rating_id");
        return rating;
      } else if (appointment_id) {
        const rating = await Rating.query()
          .where("appointment_id", appointment_id)
          .orWhereNull("appointment_id");
        return rating;
      } else {
        throw new Error("invalid params");
      }
    } catch (error) {
      response.badRequest(error);
    }
  }

  public async create({ request, response }: HttpContextContract) {
    try {
      const {
        customer_comment,
        appointment_id,
        customer_rating,
        customer_id,
        provider_rating,
        provider_id,
        provider_comment,
      } = request.body();
      if (customer_comment && customer_rating) {
        const appointment = await Appointment.findOrFail(appointment_id);
        appointment.merge({
          customer_rating: true,
        });
        const findRating = await Rating.findBy(
          "appointment_id",
          appointment_id
        );
        if (findRating != null) {
          findRating.merge({
            appointment_id,
            customer_comment,
            customer_rating,
            customer_id,
          });
          await findRating.save();
          await appointment.save();
          return findRating;
        } else {
          const rating = await Rating.create({
            appointment_id,
            customer_comment,
            customer_rating,
            customer_id,
          });
          await appointment.save();
          return rating;
        }
      } else if (provider_comment && provider_rating) {
        const appointment = await Appointment.findOrFail(appointment_id);
        appointment.merge({
          provider_rating: true,
        });
        const findRating = await Rating.findBy(
          "appointment_id",
          appointment_id
        );
        if (findRating != null) {
          findRating.merge({
            appointment_id,
            provider_comment,
            provider_id,
            provider_rating,
          });
          await findRating.save();
          await appointment.save();
          return findRating;
        } else {
          const rating = await Rating.create({
            appointment_id,
            provider_comment,
            provider_id,
            provider_rating,
          });
          await appointment.save();
          return rating;
        }
      }
    } catch (error) {
      response.badRequest(error);
    }
  }
}
