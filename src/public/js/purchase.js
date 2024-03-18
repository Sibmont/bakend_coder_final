// // purchase.js

// // // Define a function to handle form submission
// const handlePaymentIntentReceived = (event) => {
//   const paymentIntent = event.detail;
//   // Handle payment intent data
//   console.log("Payment intent received:", paymentIntent);
//   // Proceed with payment using payment intent data
// };

// // Listen for payment intent received event
// window.addEventListener("paymentIntentReceived", handlePaymentIntentReceived);

// document.addEventListener("DOMContentLoaded", function () {
//   // Create a Stripe instance with your public key
//   const stripe = Stripe(
//     "pk_test_51OoEBZFPveRXrbA06CH6wZvSuz9skfw2SegO3xOsdeMFjl0xpRpRpakuI5hHIYYXoI1GsdwiyE2t8XIEL7YEp9Q700yRUdOyD8"
//   );
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // Retrieve form data
//       const formData = {
//         cardNumber: document.getElementById("card-number").value,
//         expMonth: document.getElementById("expiry-date").value,
//         cvv: document.getElementById("cvv").value,
//         name: document.getElementById("cardholder-name").value,
//         // Add any other required form fields here
//       };

//       // Use Stripe.js to confirm the payment intent
//       const { error, paymentIntent } = await stripe.confirmCardPayment(
//         clientSecret,
//         {
//           payment_method: {
//             card: elements.getElement("card"),
//             billing_details: {
//               name: formData.name,
//               // Add any other billing details here
//             },
//           },
//         }
//       );

//       // Handle confirmation result
//       if (!error) {
//         // Payment succeeded
//         // createAlertWithCallback(
//         //   "success",
//         //   "Payment completed!",
//         //   "The payment has been processed successfully",
//         //   () => {
//         //     window.location.replace("/");
//         //   }
//         // );
//         console.log("Payment succeeded!");
//       } else {
//         // Payment failed
//         console.error(error);
//         // createAlert("error", "Error processing payment", error.message);
//       }
//     } catch (error) {
//       console.error(error);
//       //   createAlert(
//       //     "error",
//       //     "Error",
//       //     "An error occurred while processing payment"
//       //   );
//     }
//   };
//   const checkoutForm = document.getElementById("checkoutForm");
//   checkoutForm.addEventListener("submit", handleSubmit);
// });

// // const stripe = Stripe(
// //   "pk_test_51OoEBZFPveRXrbA06CH6wZvSuz9skfw2SegO3xOsdeMFjl0xpRpRpakuI5hHIYYXoI1GsdwiyE2t8XIEL7YEp9Q700yRUdOyD8"
// // );

// // Add event listener to the checkout form submit button
