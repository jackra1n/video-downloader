
import express, { Express, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import youtubedl from 'youtube-dl-exec';

const app: Express = express();
const port = 3000;

app.get("/download", async (req: Request, res: Response) => {
	if (req.query.url == null) {
		res.send("No url query parameter provided");
		return;	
	}
	youtubedl(req.query.url.toString(), {
		noWarnings: true,
		preferFreeFormats: true,
        format: 'mp4',
        output: 'videos/%(title)s-%(id)s.%(ext)s',
		addHeader: [
		'referer:youtube.com',
		'user-agent:googlebot'
		]
	}).then(output => { res.send("finished downloading")});
});

app.get('/files', (req: Request, res: Response) => {
	let files = fs.readdirSync(path.join(__dirname, '../videos'));
	res.send(files);
});

app.listen(port, () => { 
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`) 
})
