import fs from "fs";
import path from "path";
import glob from "fast-glob";
import zip from "jszip";
import { fileURLToPath } from "url";
import crypto from "crypto";
import child_process from "child_process";

function exec(cmd) {
    return child_process
        .execSync(cmd, {
            encoding: "utf-8",
            cwd: path.dirname(fileURLToPath(import.meta.url)),
        })
        .toString("utf-8")
        .trim();
}

// 先恢复插件描述文件，保证和远程文件一致
exec(`git checkout -- dist/`);

if (exec(`git status --porcelain`) !== "") {
    console.error("请先暂存或者提交代码，保证工作区和远程仓库一致");
    process.exit(1);
}

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "widgets");
const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), "dist");

function generateUUID(widget) {
    const hash = crypto.createHash("sha256");
    hash.update(widget);
    const hashHex = hash.digest("hex");
    const uuid = `${hashHex.substr(0, 8)}-${hashHex.substr(8, 4)}-${hashHex.substr(12, 4)}-${hashHex.substr(16, 4)}-${hashHex.substr(20, 12)}`;
    return uuid;
}

function getModifyDate(name) {
    const date = exec(`git log -1 --date=iso --format="%ad" -- widgets/${name}`);
    return +new Date(date);
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
    if (fs.existsSync(dist)) {
        fs.rmSync(path.join(dist, "./*.zip"), { recursive: true, force: true });
    } else {
        fs.mkdirSync(dist);
    }
    const widgets = fs
        .readdirSync(root)
        .map((child) => child)
        .filter((child) => fs.statSync(path.join(root, child)).isDirectory() && fs.existsSync(path.join(root, child, "widget.json")))
        .sort();
    const lastPublishInfo = JSON.parse(fs.readFileSync(path.join(dist, "widgets.json")).toString()).reduce((data, item) => {
        data[item.id] = item;
        return data;
    }, {});
    for (let i = 0; i < widgets.length; i++) {
        const widget = widgets[i];
        const id = generateUUID(widget);
        const widgetConfig = JSON.parse(fs.readFileSync(path.join(root, widget, "widget.json")).toString());
        const updateAtTime = getModifyDate(widget);
        if (lastPublishInfo[id]) {
            if (lastPublishInfo[id].updateAt >= updateAtTime) {
                lastPublishInfo[id].updateAt = updateAtTime;
                continue;
            }
            lastPublishInfo[id].version++;
            widgetConfig.version = lastPublishInfo[id].version;
            fs.writeFileSync(path.join(root, widget, "widget.json"), JSON.stringify(widgetConfig, null, 4));
        }
        const widgetZip = await zipWidget(widget);
        fs.writeFileSync(path.join(dist, `${generateUUID(widget)}.zip`), widgetZip);
        lastPublishInfo[id] = {
            id: id,
            title: widgetConfig.title,
            version: widgetConfig.version,
            updateAt: updateAtTime,
        };
    }
    fs.writeFileSync(path.join(dist, "widgets.json"), JSON.stringify(Object.values(lastPublishInfo), null, 4));
}

makeProdZip();
