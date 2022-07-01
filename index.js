const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s77jh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const endGameTaskCollection = client.db("Endgame-job-task").collection("addtodo");
    const endGameTaskCollectionUpdate = client.db("Endgame-job-task").collection("todoUpdate");

    // todo load
    app.get("/todo", async (req, res) => {
      const query = {};
      const oder = await endGameTaskCollection.find(query).toArray();
      res.send(oder);
    });

    // todo load single
    app.get("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await endGameTaskCollection.findOne(query);
      res.send(result);
    });
    // add to do post
    app.post("/todo", async (req, res) => {
      const item = req.body;
      const result = await endGameTaskCollection.insertOne(item);
      res.send(result);
    });

    // todo update
    app.put("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      console.log(user);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };

      const result = await endGameTaskCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    //todo delete
    app.delete("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await endGameTaskCollection.deleteOne(query);
      res.send(result);
    });

    app.post("/todoupdate", async (req, res) => {
      const item = req.body;
      const result = await endGameTaskCollectionUpdate.insertOne(item);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Endgame job task");
});

app.listen(port, () => {
  console.log("Endgame job task", port);
});
