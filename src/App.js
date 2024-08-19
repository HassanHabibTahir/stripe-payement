import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";

const PaymentCards = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [succeeded, setSucceeded] = useState(""); //
  const products = {
    prod_ApexStarter: 1000, // $10
    prod_ApexPro: 3000, // $30
    prod_ApexPremium: 5000, // $50
  };
  const PriceIds = {
    prod_ApexStarter: "price_1Pp9g1F5wRQ0UvcsCiZMcfz2",
    prod_ApexPro: "price_1PpMb3F5wRQ0UvcspGMktV4N",
    prod_ApexPremium: "price_1PpMcgF5wRQ0UvcsVZn0QkzR",
  };
  const handleSelectProduct = async (productId) => {
    const amount = products[productId];
    if (!amount) return;
    try {
      // const response = await axios.post("http://localhost:5000/create-subscription",
      //   { priceId:PriceIds[productId] ,name,
      //   email});
      // setClientSecret(response.data.clientSecret);
      setSelectedProduct(PriceIds[productId]);
    } catch (error) {
      console.error("Error fetching client secret:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const response = await axios.post(
      "http://localhost:5000/create-subscription",
      { priceId: selectedProduct, name, email }
    );
    let clientSecret = response?.data?.clientSecret;
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,

      {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name,
            email,
          },
        },
      }
    );
    console.log(paymentIntent, "paymentIntent");
    if (error) {
      console.error("Payment error:", error);
    } else if (paymentIntent.status === "succeeded") {
      console.log("Payment successful!");
      setSucceeded("Payment successful!");
      // Optionally, handle successful payment (e.g., show a success message)
    }
  };


  return (
    <div className="container">
      {!selectedProduct ? (
        <div className="card-container">
          {/* Apex Starter Card */}
          <div className="card">
            <div className="card-header">
              <h2>Apex Starter</h2>
            </div>
            <div className="card-body">
              <div className="card-price">$10 / month</div>
              <div className="card-description">
                Basic plan with essential features.
              </div>
            </div>
            <br />
            <br />
            <button
              className="select-button"
              onClick={() => handleSelectProduct("prod_ApexStarter")}
            >
              Select
            </button>
          </div>

          {/* Apex Pro Card */}
          <div className="card">
            <div className="card-header">
              <h2>Apex Pro</h2>
            </div>
            <div className="card-body">
              <div className="card-price">$30 / month</div>
              <div className="card-description">
                Advanced features for growing businesses.
              </div>
            </div>
            <br />
            <br />
            <button
              className="select-button"
              onClick={() => handleSelectProduct("prod_ApexPro")}
            >
              Select
            </button>
          </div>

          {/* Apex Premium Card */}
          <div className="card">
            <div className="card-header">
              <h2>Apex Premium</h2>
            </div>
            <div className="card-body">
              <div className="card-price">$50 / month</div>
              <div className="card-description">
                All features included for premium users.
              </div>
            </div>
            <br />
            <br />
            <button
              className="select-button"
              onClick={() => handleSelectProduct("prod_ApexPremium")}
            >
              Select
            </button>
          </div>
        </div>
      ) : (
        <div className="payment-form-container">
          <h2>Complete Payment</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>
                Name:
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Email:
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
            </div>
            <div>
              <CardElement />
            </div>
            <button type="submit">Pay</button>
            {succeeded && <div>{succeeded}</div>}
          </form>
        </div>
      )}
    </div>
  );
};

export default PaymentCards;
