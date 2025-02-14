import * as Yup from "yup"
import Order from "../Schemas/Order";
import Product from "../models/Product"
import User from "..//models/User"

import Category from "../models/Category"
import { response } from "express";

class OrderController {
    async store(request, response) {
        const schema = Yup.object({
            products: Yup.array().required().of(
                Yup.object({
                    id: Yup.number().required(),
                    quantity: Yup.number().required()
                })
            )


        });

        try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });

        }


        const { products } = request.body;

        const productsIds = products.map(product => product.id)
        const findProducts = await Product.findAll({
            where: {
                id: productsIds,
            },
            include: [
                {
                    model: Category,
                    as: "category",
                    attributes: ["name"],
                }
            ]

        })
        const formatProducts = findProducts.map(product => {

            const productindex = products.findIndex(
                item => item.id === product.id

            )

            const newproduct = {
                id: product.id,
                name: product.name,
                category: product.category,
                price: product.price,
                url: product.url,
                quantity: products[productindex].quantity,

            }
            return newproduct
        })


        const order = {
            user: {
                id: request.userId,
                name: request.userName,
            },
            products: formatProducts,
            status: 'pedido realizado',
        }
            ;
        const createdOrder = await Order.create(order)


        return response.status(201).json(createdOrder)
    }
    async index(request, response) {
        const orders = await Order.find()

        return response.json(orders)
    }

    async update(request, response) {
        const schema = Yup.object({
            status: Yup.string().required()



        });

        try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });

        }

        const  {admin:isAdmin} = await User.findByPk(request.userId)

        if(!isAdmin){
            return response.status(401).json()
        }
        
        const { id } = request.params;

        const { status } = request.body;
        try {
            await Order.updateOne({ _id: id }, { status })
        } catch(err) {
            return response.status(400).json({ error: err.message })
        }

        return response.json({
            message: "status updated sucessifully"
        })
    }

}
export default new OrderController()

