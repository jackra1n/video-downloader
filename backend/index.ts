
import express, { Express, Request, Response } from 'express';
import fs from 'fs-extra';
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
		writeThumbnail: true,
		format: 'mp4',
		output: 'videos/%(title)s-%(id)s.%(ext)s',
		addHeader: [
			'referer:youtube.com',
			'user-agent:googlebot'
		]
	}).then(output => { res.send("finished downloading") });
});

app.get('/file', (req: Request, res: Response) => {
	if (req.query.name == null) {
		res.send("No name query parameter provided");
		return;
	}
	const file = path.join(__dirname, '../videos', req.query.name.toString());
	console.log(file);
	try {
		res.sendFile(file);
	} catch (err) {
		res.send(err);
	}
});

app.get('/files', async (req: Request, res: Response) => {
	const directoryPath = path.join(__dirname, '../videos');

	try {
		const files = await fs.readdir(directoryPath);

		const fileDetails = await Promise.all(
			files.map(async (file) => {
				const filePath = path.join(directoryPath, file);

				const stats = await fs.stat(filePath);
				const creationDate = stats.birthtime;

				// Get thumbnail from file
				const thumbnail = await getThumbnail(filePath); // Custom function to retrieve thumbnail

				return {
					name: file,
					creationDate: creationDate,
					thumbnail: thumbnail,
				};
			})
		);

		res.json(fileDetails);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

async function getThumbnail(filePath: string): Promise<string> {
	const thumbnailPath = path.join(path.dirname(filePath), 'thumbnails', `${path.basename(filePath)}.thumb.jpg`);

	try {
		await fs.ensureDir(path.dirname(thumbnailPath));

		// Read the file contents and create a base64-encoded thumbnail
		const fileContents = await fs.readFile(filePath);
		const thumbnail = `data:image/jpeg;base64,${fileContents.toString('base64')}`;

		return thumbnail;
	} catch (err) {
		console.error(`Error generating thumbnail for ${filePath}`, err);
		throw err;
	}
}

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
