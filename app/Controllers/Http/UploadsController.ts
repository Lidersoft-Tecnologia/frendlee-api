import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Cloudinary from 'App/Services/CloudinaryService'

export default class UploadsController {
  public async index({ request, response }: HttpContextContract) {
    try {
      const file = request.file("image", {
        extnames: ["jpg", "png"],
        size: "3mb",
      });

      const cloudinaryResponse = await Cloudinary.v2.uploader.upload(file?.tmpPath, {folder: 'frendlee'});
      response.ok({
        message: "Image upload successfully.",
        status: 200,
        data: {
          url: cloudinaryResponse.secure_url,
          name: cloudinaryResponse.original_filename
        },
      })
    } catch (error) {
      response.internalServerError({
        message: "Error in upload image.",
        error: error,
        status: 500,
        data: null,
      });
    }
  }
}
