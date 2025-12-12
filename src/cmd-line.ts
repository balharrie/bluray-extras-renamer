import { NormalisedExtra } from "./file-classifier";
import { getVideoDurations } from "./get-video-durations";
import { mapExtrasByDuration } from "./map-extras";
import { renameFile } from "./rename-files";
import { scrapeExtras } from "./scrape-dvd-compare";
import process from "process";

const [, , dirArg, urlArg, dryRunArg] = process.argv;

if (!dirArg || !urlArg) {
    console.error("Usage:");
    console.error("  npm: npm start --dir=\"<dir>\" --url=\"<url>\" --dryrun=true");
    console.error("");
    console.error("Examples:");
    console.error('  npm start --dir="/Volumes/MakeMKV/The Dark Knight Rises Bonus Disc" --url="https://dvdcompare.net/comparisons/film.php?fid=21586" --dryRun=true');
    process.exit(1);
}

const dryRunFlag = dryRunArg?.toLocaleLowerCase() === "true";

if (dryRunFlag) {
    console.info("Dry run mode enabled - no files will be renamed.\n");
}

(async (dir: string, url: string, dryRun: boolean) => {
    console.info(`Scanning ${dir}`)
    const map = await getVideoDurations(dir);
    console.log(map);

    console.info(`Finding extras ${url}`)
    const extras = await scrapeExtras(url, "United Kingdom");
    console.log(extras);

    const extraByDuration: Map<string, NormalisedExtra[]> = mapExtrasByDuration(extras);

    map.forEach((filenames: string[], key: string) => {
        renameFile(dryRun, dir, filenames[0], extraByDuration.get(key)?.[0]);
    });
})(
    dirArg, urlArg, dryRunFlag
);