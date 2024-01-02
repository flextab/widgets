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

function getIgnores(name, dir = root) {
    // 大文件请不要打包，否则会影响实际使用编译速度，所以填写 .flextabignore 文件来忽略
    // 读取 .flextabignore
    const filePath = path.join(dir, name, ".flextabignore");
    if (fs.existsSync(filePath)) {
        const lines = fs
            .readFileSync(filePath)
            .toString()
            .split("\n")
            .map((file) => {
                if (!file.startsWith("#")) {
                    return path.join(dir, name, file);
                }
            })
            .filter(Boolean);
        lines.push(path.join(dir, name, ".flextabignore"));
        if (fs.existsSync(".flextablargefiles")) {
            lines.push(path.join(dir, name, ".flextablargefiles"));
        }
        return lines;
    }
}

function getLargeFiles(name, dir = root) {
    // 大文件请不要打包，否则会影响实际使用编译速度，所以填写 .flextabignore 文件来忽略
    // 读取 .flextabignore
    const filePath = path.join(dir, name, ".flextablargefiles");
    if (fs.existsSync(filePath)) {
        const lines = fs
            .readFileSync(filePath)
            .toString()
            .split("\n")
            .map((file) => {
                if (!file.startsWith("#")) {
                    return path.join(dir, name, file);
                }
            })
            .filter(Boolean);
        return lines;
    } else {
        return getIgnores(name, dir);
    }
}

function getModifyDate(name) {
    const files = exec(`git ls-files widgets/${name}`).split("\n");
    const i = files.indexOf(`widgets/${name}/widget.json`);
    const ignores = getIgnores(name, "widgets");
    if (i != -1) {
        files.splice(i, 1);
    }
    if (ignores) {
        for (let i = 0; i < ignores.length; i++) {
            const index = files.indexOf(ignores[i]);
            if (index != -1) {
                files.splice(index, 1);
            }
        }
    }
    return files.reduce((date, file) => {
        return Math.max(date, +new Date(exec(`git log -1 --date=iso --format="%ad" -- ${file}`)));
    }, 0);
}

async function zipWidget(name) {
    const widget = path.join(root, name);
    const z = new zip();
    const ignores = getIgnores(name);
    const files = glob.sync(widget + "/**/*", {
        ignore: ignores,
    });
    let manifest = {};
    for (let i = 0; i < files.length; i++) {
        const relativePath = path.relative(widget, files[i]);
        let buf = await fs.promises.readFile(path.join(files[i]));
        if (relativePath === "widget.json") {
            manifest = JSON.parse(buf.toString());
            manifest.extra = manifest.extra || {};
            manifest.extra.projectName = name;
            buf = JSON.stringify(manifest);
        }
        z.file(relativePath, buf);
    }
    const largeFiles = getLargeFiles(name);
    if (largeFiles) {
        const largeFilesList = glob
            .sync(
                [
                    ...largeFiles,
                    ...largeFiles
                        .map((file) => {
                            if (fs.statSync(file).isDirectory()) {
                                return path.join(file, "/*");
                            }
                        })
                        .filter(Boolean),
                ],
                {}
            )
            .filter((path) => !path.endsWith(".flextabignore") && !path.endsWith(".flextablargefiles"))
            .map((file) => {
                return path.relative(widget, file);
            });
        if (largeFilesList.length) {
            manifest.extra.largeFiles = largeFilesList;
            z.file("widget.json", JSON.stringify(manifest));
        }
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
