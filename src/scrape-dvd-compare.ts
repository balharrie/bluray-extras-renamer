import axios from "axios";
import * as cheerio from "cheerio";

export interface Extra {
    title: string;
    duration: string | null;
}

export const scrapeExtras = async (url: string, language: string): Promise<Extra[]> => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const extras: Extra[] = [];

        // Find all release blocks
        $("ul.dvd").each((_, ulElem) => {
            const heading = $(ulElem).find("h3").first().text().trim();

            // Only process the United Kingdom edition
            if (heading.includes(language)) {
                // Find the Extras label inside this block
                $(ulElem)
                    .find("div.label")
                    .each((_, labelElem) => {
                        const label = $(labelElem).text().trim();
                        if (label === "Extras:") {
                            const descriptionElem = $(labelElem).next("div.description");
                            const rawHtml = descriptionElem.html() || "";

                            const parts = rawHtml
                                .split(/<br\s*\/?>/i)
                                .map((p) => p.replace(/<[^>]+>/g, "").trim())
                                .filter((p) => p.length > 0);

                            for (const part of parts) {
                                const match = part.match(/\((\d{1,2}:\d{2})\)/);
                                const duration = match ? match[1] : null;
                                const title = part.replace(/\(\d{1,2}:\d{2}\)/, "").trim();

                                extras.push({ title, duration });
                            }
                        }
                    });
            }
        });

        return extras;
    } catch (error) {
        console.error("Error scraping UK extras:", error);
        return [];
    }
};