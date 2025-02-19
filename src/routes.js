import {Router} from "express"
import multer from "multer"
import multerconfig from "./config/multer"

import UserControllers from "./app/controllers/UserControllers"
import SessionController from "./app/controllers/SessionController"
import productController from "./app/controllers/productController"
import CategoryController from "./app/controllers/CategoryController"
import authMiddleware from "./app/middlewares/auth"
import OrderController from "./app/controllers/OrderController"
import CreatePaymentIntentController from "./app/controllers/stripe/CreatePaymentIntentController"



const routes = new Router()

const upload = multer(multerconfig)

routes.post("/users", UserControllers.store)
routes.post("/session", SessionController.store)

routes.use(authMiddleware)

routes.post("/products", upload.single("file"), productController.store)
routes.get("/products", productController.index),
routes.put("/products/:id", upload.single("file"), productController.update)

routes.post("/categories", upload.single("file"), CategoryController.store)
routes.get("/categories", CategoryController.index),
routes.put("/categories/:id", upload.single("file"), CategoryController.update)


routes.post("/orders", OrderController.store)
routes.get("/orders", OrderController.index)


routes.post("/create-payment-intent",CreatePaymentIntentController.store)

export default routes;