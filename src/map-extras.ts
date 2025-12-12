import { classifyExtra, NormalisedExtra } from "./file-classifier";
import { Extra } from "./scrape-dvd-compare";

export const mapExtrasByDuration = (extras: Extra[]): Map<string, NormalisedExtra[]> => {
    const extraByDuration = new Map<string, NormalisedExtra[]>();

    extras.forEach((extra) => {
        if (!extra.duration) {
            return;
        }
        if (!extraByDuration.has(extra.duration)) {
            extraByDuration.set(extra.duration, []);
        }
        extraByDuration.get(extra.duration)!.push(classifyExtra(extra.title));
    });

    return extraByDuration;
}