import express from "express";
import { MongoClient, ServerApiVersion } from "mongodb";

const app = express();

app.use(express.json());

let db;

async function connectToDb() {
	const uri = "mongodb://127.0.0.1:27017";
	const client = new MongoClient(uri, {
		serverApi: {
			version: ServerApiVersion.v1,
			strict: true,
			deprecationErrors: true,
		},
	});

	await client.connect();

	db = client.db("full-stack-act-db");
}

app.get("/api/articles/:name", async (req, res) => {
	const { name } = req.params;
	const articles = await db.collection("articles").findOne({ name });
	res.json(articles);
});

app.post("/api/articles/:name/upvote", async (req, res) => {
	const { name } = req.params;
	const updatedArticle = await db
		.collection("articles")
		.findOneAndUpdate(
			{ name },
			{ $inc: { upvotes: 1 } },
			{ returnDocument: "after" },
		);

	return res.json(updatedArticle);
});

app.post("/api/articles/:name/comments", async (req, res) => {
	const { name } = req.params;
	const { postedBy, text } = req.body;
	const newComment = { postedBy, text };

	const updatedArticle = await db
		.collection("articles")
		.findOneAndUpdate(
			{ name },
			{ $push: { comments: newComment } },
			{ returnDocument: "after" },
		);

	return res.json(updatedArticle);
});

async function start() {
	await connectToDb();

	app.listen(8000, () => {
		console.log("Server is listening on port 8000");
	});
}

start();
