import * as fs from "fs";
import * as path from "path";
import { execFile } from "child_process";

// Helper: run ffprobe to get duration in seconds
const getDuration = async (filePath: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        execFile(
            "ffprobe",
            [
                "-v",
                "error",
                "-show_entries",
                "format=duration",
                "-of",
                "default=noprint_wrappers=1:nokey=1",
                filePath,
            ],
            (err, stdout) => {
                if (err) { console.error(err); return reject(err); }
                resolve(parseFloat(stdout.trim()));
            }
        );
    });
}

// Format seconds → mm:ss
const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Scan directory of video files and build map
export const getVideoDurations = async (dir: string): Promise<Map<string, string[]>> => {
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mkv") || f.endsWith(".mp4"));
    const map = new Map<string, string[]>();

    for (const file of files) {
        const fullPath = path.join(dir, file);
        try {
            const durationSec = await getDuration(fullPath);
            const durationStr = formatDuration(durationSec);

            if (!map.has(durationStr)) {
                map.set(durationStr, []);
            }
            map.get(durationStr)!.push(file);
        } catch (err) {
            console.error(`Failed to get duration for ${file}:`, err);
        }
    }

    return map;
}