import express from 'express';

const app = express();

app.use(express.json());

app.get('/hello', (req, res) => {
	res.send("Hello! This is the back-end server.");
})

app.post("/submit", (req, res) => {
	res.send(`Hello! ${req.body.name}, your form has been submitted.`);
})

app.listen(8000, () => {
  console.log("Server is listening on port 8000");
});