import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

function getHit(id) {
    return new Promise((r, j) => {
        const options = {
            hostname: "hits.sh",
            path: `/widget.flextab.art/${id}.svg`,
            method: "GET",
        };
        const req = https.request(options, (res) => {
            let data = "";
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => {
                r(parseInt(data.replace(/,/g, "").match(/hits: (\d+)/)[1]) || 0);
            });
        });
        req.on("error", () => {
            j();
        });
        req.end();
    });
}

const internelWidgetIds = ["link", "background", "search", "runningbear"];
const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), "dist");
const widgets = JSON.parse(fs.readFileSync(path.join(dist, "widgets.json")).toString());

async function generateHit() {
    const widgetIds = [...internelWidgetIds, ...widgets.map((w) => w.id)];
    const hitsData = {};
    for (let i = 0; i < widgetIds.length; i++) {
        const id = widgetIds[i];
        hitsData[id] = {};
        const hit = await getHit(id);
        hitsData[id].hot = hit;
    }
    fs.writeFileSync(path.join(dist, "hits.json"), JSON.stringify(hitsData, null, 4));
}

generateHit();
