const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

const port = process.env.PORT || 5000;
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xasmzpl.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// client.connect((err) => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

async function run() {
  try {
    const usersCollection = client.db("autoStyx").collection("users");
    const categoriesCollection = client.db("autoStyx").collection("categories");
    const productsCollection = client.db("autoStyx").collection("products");
    const advertiseCollection = client.db("autoStyx").collection("advertise");
    const bookingsCollection = client
      .db("autoStyx")
      .collection("bookingProduct");

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const role = req.query.role;
      const query = { role: role };
      const users = await usersCollection.find(query).toArray();
      res.send(users);
    });

    app.get("/categories", async (req, res) => {
      const query = {};
      const users = await categoriesCollection.find(query).toArray();
      res.send(users);
    });

    app.get("/categories/:id", async (req, res) => {
      const id = req.params.id;
      const query = { category_id: id };
      const service = await productsCollection.find(query).toArray();
      res.send(service);
    });

    app.post("/products", async (req, res) => {
      const product = req.body;

      const result = await productsCollection.insertOne(product);
      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const email = req.query.email;
      const query = { seller_email: email };
      const bookings = await productsCollection.find(query).toArray();
      res.send(bookings);
    });

    app.post("/advertise", async (req, res) => {
      const advertise = req.body;
      const query = {
        name: advertise.name,
        resalePrice: advertise.resalePrice,
      };
      const alreadyAdded = await advertiseCollection.find(query).toArray();

      if (alreadyAdded.length) {
        const message = `You already have booking on `;
        return res.send({ acknowledged: false, message });
      }
      const result = await advertiseCollection.insertOne(advertise);
      res.send(result);
    });

    app.get("/advertise", async (req, res) => {
      const query = {};
      const advertise = await advertiseCollection.find(query).toArray();
      res.send(advertise);
    });

    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const query = {
        user_email: booking.user_email,
        Product_name: booking.Product_name,
      };
      const alreadyBooked = await bookingsCollection.find(query).toArray();

      if (alreadyBooked.length) {
        const message = `You already have booking on ${booking.appointmentDate}`;
        return res.send({ acknowledged: false, message });
      }
      const result = await bookingsCollection.insertOne(booking);
      res.send(result);
    });

    app.get("/bookings", async (req, res) => {
      const email = req.query.user_email;
      const query = { email: email };
      const bookings = await bookingsCollection.find(query).toArray();
      res.send(bookings);
    });
  } finally {
  }
}
run().catch((err) => console.error(err));

app.get("/", async (req, res) => {
  res.send("AutoStyx server is running");
});

app.listen(port, () => console.log(`AutoStyx server running on ${port}`));
