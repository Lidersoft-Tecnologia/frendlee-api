import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Address from "App/Models/Address";
import ApiToken from "App/Models/ApiToken";
import Customer from "App/Models/Customer";
import users from "App/Models/users";

export default class CustomersController {
    public async index({ response }: HttpContextContract) {
        try {
            const customers = await Customer.all();
            const customer_list: Array<any> = [];

            for (const customer of customers) {
                const user: any = await users.findByOrFail("id", customer.user_id);
                const address: any = await Address.findByOrFail(
                    "id",
                    customer.address_id
                );

                customer_list.push({
                    ...customer.$original,
                    user,
                    address,
                });
            }

            return customer_list;
        } catch (error) {
            response.status(400).send({
                error: {
                    message: "",
                    error_message: error,
                },
            });
        }
    }

    public async findById({ response, request, auth }: HttpContextContract) {
        try {
            const { id } = request.params();

            if (id && auth.user) {
                const customer = await Customer.findOrFail(id);
                const user = await users.findByOrFail("id", customer.user_id);
                const address = await Address.findByOrFail("id", customer.address_id);
                const tokenFound = await ApiToken.findBy("user_id", customer.user_id);

                return {
                    ...customer.$original,
                    token: tokenFound?.token || null,
                    user,
                    address,
                };
            } else {
                throw new Error();
            }
        } catch (error) {
            response.status(400).send({
                error: {
                    message: "",
                    error_message: error,
                },
            });
        }
    }

    public async findByToken({ response, request, auth }: HttpContextContract) {
        try {
            const { token } = request.params();
            if (token && auth.user) {
                const { user_id } = await ApiToken.findByOrFail("token", token);
                const customer = await Customer.findByOrFail("user_id", user_id);
                const user = await users.findByOrFail("id", customer.user_id);
                const address = await Address.findByOrFail("id", customer.address_id);

                return {
                    ...customer.$original,
                    token,
                    user,
                    address,
                };
            } else {
                throw new Error();
            }
        } catch (error) {
            response.status(400).send({
                error: {
                    message: "",
                    error_message: error,
                },
            });
        }
    }

    public async update({ request, response }: HttpContextContract) {
        try {
            const { id } = request.params();
            const body = request.body();
            const customer = await Customer.findOrFail(id);
            await customer.merge(body).save();
            response.status(200).send({
                message: "Customer updated successful!",
                status: 200,
                data: customer,
            });
        } catch (error) {
            response.status(500).send({
                error: {
                    message: "Provider not updated, error.",
                    error_message: error,
                },
            });
        }
    }

    public async updatePictureProfile({ request, response }: HttpContextContract) {
        try {
            const { id } = request.params();
            const body = request.body();
            const customer = await Customer.findOrFail(id);
            await customer.merge(body).save();
            response.status(200).send({
                message: "Customer updated successful!",
                status: 200,
                data: customer,
            });
        } catch (error) {
            response.status(500).send({
                error: {
                    message: "Provider not updated, error.",
                    error_message: error,
                },
            });
        }
    }
}

