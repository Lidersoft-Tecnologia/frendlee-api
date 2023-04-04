import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Address from 'App/Models/Address'

export default class AddressesController {
    public async index({ response }: HttpContextContract) {
        try {
            const address = await Address.all();
            return address;
        } catch (error) {
            response.badRequest(error);
        };
    };

    public async find({ response, request }: HttpContextContract) {
        try {
            const { id } = request.params();
            const address = await Address.findOrFail(id);
            return address;
        } catch (error) {
            response.badRequest(error);
        };
    };
}
