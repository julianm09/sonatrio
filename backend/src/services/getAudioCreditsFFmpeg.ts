import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

// Function to convert seconds to credits (1 credit = 1 minute)
const convertSecondsToCredits = (seconds: number): number => {
	return Math.round(seconds / 60); // Round normally
};

// Function to get audio duration and convert to credits
export const getAudioCreditsFFmpeg = async (
	fileBuffer: Buffer,
	originalName: string
): Promise<number> => {
	const tempPath = path.join(__dirname, `temp_${Date.now()}_${originalName}`);
	await writeFile(tempPath, fileBuffer);

	return new Promise((resolve, reject) => {
		ffmpeg.ffprobe(tempPath, async (err, metadata) => {
			await unlink(tempPath); // Clean up the temp file

			if (err) {
				console.error("Error extracting duration:", err);
				return reject(err);
			}

			const durationInSeconds = metadata.format.duration || 0;
			const credits = convertSecondsToCredits(durationInSeconds);
			resolve(credits);
		});
	});
};
