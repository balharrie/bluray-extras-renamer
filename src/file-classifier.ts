export type ExtraType =
    | "behindthescenes"
    | "deleted"
    | "featurette"
    | "interview"
    | "scene"
    | "short"
    | "trailer"
    | "other";

export interface NormalisedExtra {
    cleaned: string;
    type: ExtraType;
}

export const classifyExtra = (raw: string): NormalisedExtra => {
    // Step 1: remove all leading dashes and spaces
    let cleaned = raw.replace(/^[\s-]+/, "").trim();

    // Step 2: remove surrounding quotes if present
    cleaned = cleaned.replace(/^"(.*)"$/, "$1");

    // Step 3: classify based on keywords
    const lower = cleaned.toLowerCase();

    let type: ExtraType = "featurette";
    if (
        lower.includes("making") ||
        lower.includes("behind") ||
        lower.includes("production") ||
        lower.includes("40 years on")
    ) {
        type = "behindthescenes";
    } else if (lower.includes("deleted")) {
        type = "deleted";
    } else if (lower.includes("featurette")) {
        type = "featurette";
    } else if (lower.includes("interview")) {
        type = "interview";
    } else if (lower.includes("scene")) {
        type = "scene";
    } else if (lower.includes("short")) {
        type = "short";
    } else if (lower.includes("trailer")) {
        type = "trailer";
    }

    return { cleaned, type };
};
