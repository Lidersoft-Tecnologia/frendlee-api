import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AccountType from 'App/Models/AccountType';

export default class AccountTypesController {
    public async index({ response } : HttpContextContract){
        try {
            const accounttypes = AccountType.all();
            return accounttypes;
        } catch (error) {
            response.badRequest(error);
        };
    };

    public async create({ request, response } : HttpContextContract){
        try {
            const { name } = request.only(['name']);
            const accounttypes = AccountType.create({
                name
            });
            return accounttypes;
        } catch (error) {
            response.badRequest(error);
        };
    };
}
