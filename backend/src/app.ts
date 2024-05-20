import express from "express";
import { Response } from "express";

const app = express();
const port = 3000;

app.listen(port, () => {
	return console.log(`Express server is listening at http://localhost:${port} 🚀`);
});

app.get('/', (res: Response) => {
	res.send('Hello NOD Readers!');
});