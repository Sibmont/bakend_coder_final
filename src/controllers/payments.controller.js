import logger from "../config/logger.js";
import {
  getCartProducts as getCartProductsService,
  getCarts as getCartsService,
} from "../services/carts.service.js";
import PaymentService from "../services/payments.service.js";

const paymentIntent = async (req, res) => {
  try {
    const userEmail = req.user.email;

    const carts = await getCartsService();

    const cartToBuy = carts.payload.find(
      (cart) => cart.user.email === userEmail
    );

    const orderDetails = {};
    cartToBuy.products.forEach((product) => {
      orderDetails[product.product.title] = product.quantity;
    });
    console.log(`Details: ${JSON.stringify(orderDetails)}`);

    let totalPrice = cartToBuy.products.reduce((accum, currentProd) => {
      const productPrice = currentProd.product.price * currentProd.quantity;

      return accum + productPrice;
    }, 0);

    const paymentIntentInfo = {
      amount: totalPrice * 100,
      currency: "usd",
      metadata: {
        userId: req.user.email,
        orderDetails: JSON.stringify(orderDetails, null, "\t"),
      },
    };

    const paymentService = new PaymentService();

    const result = await paymentService.createPaymentIntent(paymentIntentInfo);
    console.log(result);

    res.sendSuccess(result);
  } catch (error) {
    logger.error(error.message);
    return res.sendServerError(error);
  }
};

export { paymentIntent };
