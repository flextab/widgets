// 由于这个应用有一些比较大的文件，不适合在前端进行编译处理，
// 所以需要在浏览器上安装后，首次使用时再去下载对应文件，然后再渲染
import { getLargeFileList, downloadLargeFile } from "widget";
import { Files } from "../largeFileIndex";

type FileKey = keyof typeof Files;

class FileManager {
    private _needDownload: boolean;
    private _files: string[];
    private _fileMap = new Map<string, File>();
    private _links = new Map<string, string>();

    constructor() {
        this._files = getLargeFileList();
        this._needDownload = !!this._files.length;
    }

    async download(progress: (p: number) => void) {
        if (this._needDownload) {
            for (let i = 0; i < this._files.length; i++) {
                const filePath = this._files[i];
                const file = await downloadLargeFile(filePath);
                this._fileMap.set(filePath, file);
                progress(+Number(((i + 1) / this._files.length) * 100).toFixed(0));
            }
        } else {
            progress(100);
        }
    }

    getFile(path: FileKey): string {
        if (this._needDownload) {
            const link = this._links.get(path);
            if (link) {
                return link;
            } else {
                const file = this._fileMap.get(path);
                if (file) {
                    this._links.set(path, URL.createObjectURL(file));
                    return this._links.get(path)!;
                }
                return "";
            }
        } else {
            const data = Files[path];
            if (typeof data === "string") {
                return data;
            } else if (data instanceof ArrayBuffer) {
                if (this._links.has(path)) {
                    return this._links.get(path)!;
                }
                const ext = path.split(".").pop();
                const link = URL.createObjectURL(new Blob([data], { type: `application/${ext}` }));
                this._links.set(path, link);
                return link;
            }
            return "";
        }
    }
}

export const FileStore = new FileManager();
