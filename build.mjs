import fs from "fs";
import path from "path";
import glob from "fast-glob";
import zip from "jszip";
import { fileURLToPath } from "url";
import crypto from "crypto";

const root = path.dirname(fileURLToPath(import.meta.url));

function generateUUID(widget) {
    const hash = crypto.createHash("sha256");
    hash.update(widget);
    const hashHex = hash.digest("hex");
    const uuid = `${hashHex.substr(0, 8)}-${hashHex.substr(8, 4)}-${hashHex.substr(12, 4)}-${hashHex.substr(16, 4)}-${hashHex.substr(20, 12)}`;
    return uuid;
}

async function zipWidget(name) {
    const widget = path.join(root, name);
    const z = new zip();
    const files = glob.sync(widget + "/**/*");
    for (let i = 0; i < files.length; i++) {
        let buf = await fs.promises.readFile(path.join(files[i]));
        z.file(path.relative(widget, files[i]), buf);
    }
    const zBuf = await z.generateAsync({
        type: "nodebuffer",
    });
    return zBuf;
}

async function makeProdZip() {
    if (fs.existsSync(path.join(root, "dist"))) {
        fs.rmSync(path.join(root, "dist"), { recursive: true, force: true });
    }
    fs.mkdirSync(path.join(root, "dist"));
    const widgets = fs
        .readdirSync(root)
        .map((child) => child)
        .filter((child) => fs.statSync(path.join(root, child)).isDirectory() && fs.existsSync(path.join(root, child, "widget.json")));
    const widgetList = [];
    for (let i = 0; i < widgets.length; i++) {
        const widget = widgets[i];
        const widgetZip = await zipWidget(widget);
        fs.writeFileSync(path.join(root, "dist", `${generateUUID(widget)}.zip`), widgetZip);
        const manifest = JSON.parse(fs.readFileSync(path.join(root, widget, "widget.json")).toString());
        widgetList.push({
            id: generateUUID(widget),
            version: manifest.version,
            name: manifest.title,
        });
    }
    fs.writeFileSync(path.join(root, "dist", "widgets.json"), JSON.stringify(widgetList));
}

makeProdZip();
