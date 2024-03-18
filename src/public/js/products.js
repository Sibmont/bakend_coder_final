const atcButton = document.getElementById("atc-btn");

const atcButtons = document.querySelectorAll(".atc-btn");

const puchaseBotton = document.getElementById("purchase-cart-btn");
const accessToken = localStorage.getItem("accessToken");

atcButtons.forEach((button) => {
  button.addEventListener("click", async (evt) => {
    try {
      const pid = evt.currentTarget.getAttribute("data-product-id");

      if (!accessToken) {
        console.error("Access token not found");
        return;
      }

      // Include the access token in the request headers
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      };

      const userResponse = await fetch("/api/sessions/current", {
        method: "GET",
        headers,
      });
      const userData = await userResponse.json();
      const userEmail = userData.data.email;

      const cartResponse = await fetch("/api/carts", {
        method: "GET",
        headers,
      });
      const cartData = await cartResponse.json();

      const userCart = cartData.payload.find(
        (cart) => cart.user.email === userEmail
      );
      if (!userCart) {
        const newCartResponse = await fetch("/api/carts", {
          method: "POST",
          headers,
        });
        const newCartData = await newCartResponse.json();

        const newUserCart = newCartData.payload._id;

        await fetch(`/api/carts/${newUserCart}/products/${pid}`, {
          method: "POST",
          headers,
        });
      } else {
        await fetch(`/api/carts/${userCart._id}/products/${pid}`, {
          method: "POST",
          headers,
        });
      }
    } catch (error) {
      console.error(error.message);
    }
  });
});

const purchaseCartBtn = document.getElementById("purchase-cart-btn");
if (purchaseCartBtn) {
  purchaseCartBtn.addEventListener("click", async () => {
    try {
      window.location.href = "/carts"; // Redirect to the /carts view after successful purchase
    } catch (error) {
      console.error("Error purchasing cart:", error);
    }
  });
}
