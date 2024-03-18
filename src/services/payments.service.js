import Stripe from "stripe";

export default class PaymentService {
  constructor() {
    this.stripe = new Stripe(
      "sk_test_51OoEBZFPveRXrbA0WWez1iV2IeeiyxQgIDQvGqEBx3YkQ3UezcIEsko2BOG93C2EUAZSDog06HoUllD6vx3dvVY200B7b11gt1"
    );
  }

  createPaymentIntent = async (data) => {
    const paymentIntent = this.stripe.paymentIntents.create(data);
    return paymentIntent;
  };
}
