const PORT = 5000;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const routes = express.Router();
app.use("/api", routes);// /api est le repertoire et non /

// body-parser
routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(bodyParser.json());
const jsonParser = bodyParser.json();

//cors
routes.use(cors());

// mongoDB client
const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://boubacardiarra:test123@cluster0.wvgql2w.mongodb.net/marketplace?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const DATABASE = "marketplace";

// connect to server
app.listen(PORT, () => {
  console.log(`Server up and running on http://localhost:${PORT}`);
});

// connect to DB
client.connect((err) => {
  if (err) {
    throw Error(err);
  }

  !err && console.log(`Successfully connected to database`);
  const products = client.db(DATABASE).collection("products");

  // perform actions on the collection object
  routes.get("/products", function (req, res) {
    products
      .find()
      .toArray()//mettre la sorite sous forme de tableau
      .then((error, results) => {
        if (error) {
          return res.send(error);
        }
        res.status(200).send({ results });
      })
      .catch((err) => res.send(err));
  });

  const exampleObj = {
   " id": 2999999,
    "category": "Clothes",
    "name": "Winter Jacket for Women, All sizes",
    "price": 79,
  };
  routes.post("/products/add", jsonParser, function (req, res) {
    products
      .insertOne(exampleObj)
      .then(() => res.status(200).send("successfully inserted new document"))
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  });
});

//routes
routes.get("/", (req, res) => {
  res.send("Hello World!");
});
