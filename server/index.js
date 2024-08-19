const express = require("express");

const Stripe = require("stripe");
const app = express();
const stripe = Stripe(
  "sk_test_51MNHzbF5wRQ0Uvcs6AuLwHH3pdbL8x2W4NLvnOPgLTUmlZ9WvQcNuMyPixLJ8FD4wQXJI1xifmZQa5U14ujvq9g900awNYi7K3"
);
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.post("/create-subscription", async (req, res) => {
  const { priceId, name, email } = req.body;
  console.log(priceId, name, email, "priceId");
  try {
    const customer = await stripe.customers.create({
      name: name,
      email: email,
      description: "Customer for subscription",
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });

    console.log(subscription.latest_invoice.payment_intent.client_secret);
    res.send({
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (error) {
    console.log(error, "error");
    res.status(500).send({ error: error.message });
  }
});


  app.post("/webhooks", async (req, res) => {
    try {
      const event = req.body;
  
      switch (event.type) {
        case "invoice.payment_succeeded": {
          const invoice = event.data.object;
          const customer = await stripe.customers.retrieve(invoice.customer);
          const customerEmail = invoice.customer_email || customer.email;
  
          if (invoice.billing_reason === "subscription_cycle" || invoice.billing_reason === "subscription_update") {
            const subscriptionId = invoice.subscription;
            const currentPeriodEnd = invoice.lines.data[0].period.end; // End of the current period
  
            // Save or update the subscription in MongoDB
            // await Subscription.findOneAndUpdate(
            //   { subscriptionId }, 
            //   {
            //     customerId: invoice.customer,
            //     customerEmail,
            //     currentPeriodEnd,
            //   },
            //   { upsert: true, new: true }
            // );
  
            console.log(`Subscription ${subscriptionId} updated for customer ${customerEmail}`);
            res.json({ received: true });
            break;
          } else {
            res.json({ received: true });
            break;
          }
        }
        default:
          return res.status(400).end();
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });




app.listen(5000, () => console.log("Server running on port 5000"));
