import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Provider from 'App/Models/Provider';
import users from 'App/Models/users';

export default class ChecksController {
    private validateEmail(email:string) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    public async find({ response, request }: HttpContextContract) {
        try {
            const { bsn, mobile, email } = request.qs();
            if (bsn) {
                if (bsn === undefined || bsn.length < 1)
                    return false;
                const findBsn = await Provider.findBy('number_document', bsn);
                if (findBsn !== null) return false
                else return true
            } else if (mobile) {
                if (mobile === undefined || mobile.length < 1)
                    return false;
                const findMobile = await Provider.findBy('phone_number', mobile);
                if (findMobile !== null) return false;
                else return true
            } else if (email) {
                if (email === undefined || email.length < 1 || !this.validateEmail(email))
                    return false;
                const findEmail = await users.findBy('email', email);
                if (findEmail !== null) return false
                else return true
            } else {
                throw new Error('Invalid params');
            }
        } catch (error) {
            response.badRequest(error);
        };
    };
}
