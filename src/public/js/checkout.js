// const accessToken = localStorage.getItem("accessToken");

// const checkoutBtn = document.getElementById("checkout-btn");
// checkoutBtn.addEventListener("click", async () => {
//   try {
//     if (!accessToken) {
//       console.error("Access token not found");
//       return;
//     }

//     // Include the access token in the request headers
//     const headers = {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${accessToken}`,
//     };

//     const response = await fetch("/api/payments/payment-intents", {
//       method: "POST",
//       headers,
//     })
//       .then((response) => response.json())
//       .then((paymentIntent) => {
//         const event = new CustomEvent("paymentIntentReceived", {
//           detail: paymentIntent,
//         });
//         console.log("Event details:", event);
//         window.dispatchEvent(event);
//       });
//     if (response.ok) {
//       console.log("Payment intent created successfully.");
//       window.location.href = "/checkout";
//     } else {
//       console.error("Error creating payment intent:", response.statusText);
//     }
//   } catch (error) {
//     console.error("Error creating payment intent:", error);
//   }
// });

// checkout_purchase.js

document.addEventListener("DOMContentLoaded", function () {
  const accessToken = localStorage.getItem("accessToken");
  let stripe = Stripe(
    "pk_test_51OoEBZFPveRXrbA06CH6wZvSuz9skfw2SegO3xOsdeMFjl0xpRpRpakuI5hHIYYXoI1GsdwiyE2t8XIEL7YEp9Q700yRUdOyD8"
  );
  console.log(stripe);
  let elements = stripe.elements();
  console.log(elements);
  let clientSecret = null; // Store the client secret locally

  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", async () => {
      try {
        if (!accessToken) {
          console.error("Access token not found");
          return;
        }

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        };

        const response = await fetch("/api/payments/payment-intents", {
          method: "POST",
          headers,
        });

        if (response.ok) {
          console.log("Payment intent created successfully.");
          const data = await response.json();
          console.log(data.data.client_secret);
          clientSecret = data.data.client_secret; // Store the client secret
          //   initializeStripe(clientSecret);
          //   window.location.href = "/checkout";
        } else {
          console.error("Error creating payment intent:", response.statusText);
        }
      } catch (error) {
        console.error("Error creating payment intent:", error);
      }
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = {
        card: {
          number: document.getElementById("card-number").value,
          exp_month: document.getElementById("expiry-date").value.split("/")[0],
          exp_year: document.getElementById("expiry-date").value.split("/")[1],
          cvc: document.getElementById("cvv").value,
        },
        billing_details: {
          name: document.getElementById("cardholder-name").value,
        },
      };

      const { error } = await stripe.confirmPayment({
        clientSecret,
        payment_method: {
          card: formData.card,
          billing_details: formData.billing_details,
        },
        redirect: "if_required",
      });

      if (!error) {
        console.log("Payment succeeded!");
      } else {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkoutForm = document.getElementById("checkoutForm");
  if (checkoutForm) {
    console.log(clientSecret);
    checkoutForm.addEventListener("submit", handleSubmit);
  }
});
