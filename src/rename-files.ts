import * as fs from "fs";
import { ExtraType, NormalisedExtra } from "./file-classifier";

const extraTypeToDirectory: Record<ExtraType, string> = {
    "behindthescenes": "Behind The Scenes",
    "deleted": "Deleted Scenes",
    "featurette": "Featurettes",
    "interview": "Interviews",
    "scene": "Scenes",
    "short": "Shorts",
    "trailer": "Trailers",
    "other": "Other",
};

interface FileParts {
    name: string;      // filename without extension, after removing _tNN
    extension: string; // file extension (without the dot)
}

const stripTrackSuffix = (filename: string): FileParts => {
    // Remove "_t" + digits before the extension
    const cleaned = filename.replace(/_t\d+(?=\.[^.]+$)/, "");

    // Split into name and extension
    const match = cleaned.match(/^(.*)\.([^.]+)$/);
    if (!match) {
        return { name: cleaned, extension: "" }; // fallback if no extension
    }

    return { name: match[1], extension: match[2] };
};

export const renameFile = (dryRun: boolean, dir: string, filename: string, extra: NormalisedExtra | undefined) => {
    if (!extra) {
        return;
    }

    var destFilename = stripTrackSuffix(filename);

    var destDir = extraTypeToDirectory[extra.type];

    if (destDir !== undefined) {
        if (!dryRun && !fs.existsSync(`${dir}/${destDir}`)) {
            fs.mkdirSync(`${dir}/${destDir}`)
        }
        destDir = `${destDir}/`;
    }

    const toFilename = `${destDir}${extra.cleaned}-${extra.type}.${destFilename.extension}`;

    console.log(`Rename ${filename} => ${toFilename}`);
    if (!dryRun) {
        fs.renameSync(`${dir}/${filename}`, `${dir}/${toFilename}`);
    }
};