import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";

export const convertToMp3 = (
    inputPath: string,
    outputPath: string
): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(inputPath)) {
            return reject(new Error("Input file does not exist."));
        }

        ffmpeg(inputPath)
            .format("mp3")
            .output(outputPath)
            .on("end", () => {
                console.log("Conversion complete:", outputPath);
                resolve();
            })
            .on("error", (err) => {
                console.error("Error during conversion:", err.message);
                reject(err);
            })
            .run();
    });
};

// Example usage
const inputFile = path.resolve(__dirname, "../video/video.mp4"); // Replace with your video file
const outputFile = path.resolve(__dirname, "../audio/output-audio.mp3"); // Replace with your desired output file

convertToMp3(inputFile, outputFile)
    .then(() => console.log("File converted successfully."))
    .catch((error) => console.error("Error:", error.message));
