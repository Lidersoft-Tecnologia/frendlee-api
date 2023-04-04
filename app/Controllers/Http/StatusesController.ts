import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Status from 'App/Models/Status';

export default class StatusesController {
    public async index({ response }: HttpContextContract) {
        try {
            const status = Status.all();
            return status;
        } catch (error) {
            response.badRequest(error);
        };
    };

    public async create({ request, response }: HttpContextContract) {
        try {
            const { name } = request.only(['name']);
            const status = Status.create({
                name
            });
            return status;
        } catch (error) {
            response.badRequest(error);
        };
    };
}
