const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const admin = require("firebase-admin");

const decoded = Buffer.from(
  process.env.FB_SERVICE_ACCOUNT_KEY,
  "base64"
).toString("utf8");
const serviceAccount = JSON.parse(decoded);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(cors());
app.use(express.json());

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req?.headers?.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ message: "unauthorized access" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.decoded = decoded;
    next();
  } catch (error) {
    return res.status(401).send({ message: "unauthorized access" });
  }
};

const verifyTokenEmail = (req, res, next) => {
  if (req.query.email !== req.decoded.email) {
    return res.status(403).send({ message: "forbidden access" });
  }
  next();
};

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.boy7ryn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    const artifactsCollection = client
      .db("artifactDB")
      .collection("artifactsCollection");

    const likesCollection = client
      .db("artifactDB")
      .collection("likesCollection");

    // Artifact Collection

    async function getLikesCount(artifactId) {
      const artifactQuery = { artifactId: artifactId.toString() };
      return await likesCollection.countDocuments(artifactQuery);
    }

    app.get("/artifacts", async (req, res) => {
      const searchQuery = req.query.name;
      let query = {};
      if (searchQuery) {
        query = { artifact_name: { $regex: searchQuery, $options: "i" } };
      }
      const result = await artifactsCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/artifact/:id", verifyFirebaseToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await artifactsCollection.findOne(query);
      result.likes_count = await getLikesCount(result._id);
      res.send(result);
    });

    app.get("/featuredArtifacts", async (req, res) => {
      const artifacts = await artifactsCollection.find().toArray();
      for (const artifact of artifacts) {
        artifact.likes_count = await getLikesCount(artifact._id);
      }
      artifacts.sort((a, b) => b.likes_count - a.likes_count);
      const featuredArtifacts = artifacts.slice(0, 6);
      res.send(featuredArtifacts);
    });

    app.post("/artifacts", verifyFirebaseToken, async (req, res) => {
      const artifactInfo = req.body;
      const result = await artifactsCollection.insertOne(artifactInfo);
      res.send(result);
    });

    app.get(
      "/myArtifacts",
      verifyFirebaseToken,
      verifyTokenEmail,
      async (req, res) => {
        const email = req.query.email;
        const query = { adder_email: email };
        const artifacts = await artifactsCollection.find(query).toArray();
        res.send(artifacts);
      }
    );

    app.patch("/updateArtifact/:id", verifyFirebaseToken, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updates = { $set: req.body };
      const result = await artifactsCollection.updateOne(filter, updates);
      res.send(result);
    });

    app.delete("/artifact/:id", verifyFirebaseToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await artifactsCollection.deleteOne(query);
      res.send(result);
    });

    // Like Collection

    app.get(
      "/liked",
      verifyFirebaseToken,
      verifyTokenEmail,
      async (req, res) => {
        const email = req.query.email;
        const query = { userEmail: email };
        const result = await likesCollection.find(query).toArray();
        res.send(result);
      }
    );

    app.post("/likes", verifyFirebaseToken, async (req, res) => {
      const likeInfo = req.body;
      const result = await likesCollection.insertOne(likeInfo);
      res.send(result);
    });

    app.delete("/likes/:id", verifyFirebaseToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await likesCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port);
