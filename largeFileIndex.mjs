import fs from "fs";
import path from "path";
import glob from "fast-glob";
import zip from "jszip";
import { fileURLToPath } from "url";
import crypto from "crypto";
import child_process from "child_process";
import process from "process";
import inquirer from "inquirer";

const widgetName = process.argv[2];

if (!widgetName) {
    console.log("请填写插件目录名");
    process.exit(0);
}

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "widgets");

function getLargeFileList() {
    let configPath = "";
    const ignoreFilePath = path.join(root, widgetName, ".flextabignore");
    const largeFilePath = path.join(root, widgetName, ".flextablargefiles");
    if (fs.existsSync(largeFilePath)) {
        configPath = largeFilePath;
    } else if (fs.existsSync(ignoreFilePath)) {
        configPath == ignoreFilePath;
    }
    if (configPath) {
        const lines = fs
            .readFileSync(configPath)
            .toString()
            .split("\n")
            .map((file) => {
                if (file.startsWith("#")) {
                    return;
                }
                const filePath = path.join(root, widgetName, file);
                if (fs.statSync(filePath).isDirectory()) {
                    return glob.sync(filePath + "/**/*");
                } else {
                    return filePath;
                }
            })
            .flat(2)
            .filter(Boolean)
            .map((file) => {
                return path.relative(path.join(root, widgetName), file);
            });
        return lines;
    } else {
        return [];
    }
}

/**将字符串改为文件名 */
function generateLargeFileIndex() {
    const lines = getLargeFileList();
    const content = `${lines.map((p, i) => `import F${i + 1} from "${p}";`).join("\n")}

export const Files = {
${lines.map((p, i) => `   "${p}": F${i + 1},`).join("\n")}
}`;
    return content;
}

const generatePath = path.join(root, widgetName, "largeFileIndex.ts");

if (fs.existsSync(generatePath)) {
    inquirer
        .prompt({
            type: "confirm",
            message: `已经存在 widgets/${widgetName}/largeFileIndex.ts，是否覆盖？`,
            name: "confirm",
            default: true,
        })
        .then((result) => {
            if (result.confirm) {
                fs.writeFileSync(generatePath, generateLargeFileIndex());
                console.log("生成完毕");
            } else {
                console.log("未生成");
            }
        });
} else {
    fs.writeFileSync(generatePath, generateLargeFileIndex());
    console.log("生成完毕");
}
