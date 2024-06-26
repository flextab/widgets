import Storage from "local-storage";
import dayjs from "dayjs";

const defaultMovieData: DoubanData = {
    title: "泰坦尼克号 Titanic",
    link: "https://movie.douban.com/subject/1292722/",
    image: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p457760035.jpg",
    rating: "9.5",
    extra: [
        "导演: 詹姆斯·卡梅隆",
        "主演: 莱昂纳多·迪卡普里奥 / 凯特·温丝莱特 / 比利·赞恩 / 凯西·贝茨 / 弗兰西丝·费舍",
        "类型: 剧情 / 爱情 / 灾难",
        "制片国家/地区: 美国/墨西哥",
        "年份: 1998",
    ],
    comment: "我甚至连他的一张照片都没有，他只活在我的记忆里。",
};

export interface DoubanData {
    title?: string;
    link?: string;
    image?: string;
    rating?: string;
    extra?: string[];
    comment?: string;
    date?: string;
    tip?: string;
    description?: string;
}

export async function getToday(): Promise<DoubanData | undefined> {
    const todayDate = dayjs().format("YYYY-MM-DD");
    const cache = Storage.get("today") as string;
    if (cache) {
        const { todayDate: _today, data } = JSON.parse(cache);
        if (todayDate === _today) {
            return {
                ...data,
                description: Storage.get("description") as string,
            };
        } else {
            Storage.del("today");
            Storage.del("pic");
            Storage.del("description");
        }
    }
    const listData = Storage.get("list") as string;
    const list: DoubanData[] = [];
    if (listData) {
        const _listData = JSON.parse(listData);
        if (_listData.year === new Date().getFullYear()) {
            list.push(..._listData.list);
        }
    }
    if (!list.length) {
        const _listData = await (
            await window.corsFetch(
                `https://registry.npmmirror.com/@ikrong/douban-movie-calendar/latest/files/${new Date().getFullYear()}.json`
            )
        ).json();
        list.push(..._listData);
        Storage.set("list", JSON.stringify({ year: new Date().getFullYear(), list }));
    }
    const data = list.find((item) => item.date === todayDate) || JSON.parse(JSON.stringify(defaultMovieData));
    Storage.set("today", JSON.stringify({ todayDate, data }));
    let image: File | undefined;
    let description: string | undefined;
    if (data?.link) {
        description = await getDescription(data.link);
    }
    return {
        ...data,
        imageFile: image,
        description,
    };
}

export function saveImageByLink(url: string, img: string) {
    const listData = Storage.get("list") as string;
    const list: DoubanData[] = [];
    if (listData) {
        const _listData = JSON.parse(listData);
        list.push(..._listData.list);
    }
    const db = list.find((db) => db.link === url);
    if (db) {
        db.image = img;
    }
    Storage.set("list", JSON.stringify({ year: new Date().getFullYear(), list }));

    const cache = Storage.get("today") as string;
    if (cache) {
        const { todayDate: _today, data } = JSON.parse(cache);
        if (data.link === url) {
            data.image = img;
            Storage.set("today", JSON.stringify({ todayDate: _today, data }));
        }
    }
}

export async function getDescription(url: string) {
    const id = url.split("/").filter(Boolean).pop();
    const cache = Storage.get("description") as string;
    if (cache) {
        return cache;
    }
    const html = await (
        await window.corsFetch.withCustomHeaders({
            "User-Agent":
                "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-User": "?1",
            "Sec-Fetch-Dest": "document",
            "Upgrade-Insecure-Requests": "1",
        })(`https://m.douban.com/movie/subject/${id}/`)
    ).text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const description = doc.querySelector(".page .card .subject-intro .bd>p")?.textContent?.trim() as string;
    Storage.set("description", description);
    return description;
}

export async function getDetail(url: string) {
    const id = url.split("/").filter(Boolean).pop();
    const html = await (
        await window.corsFetch.withCustomHeaders({
            "User-Agent":
                "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-User": "?1",
            "Sec-Fetch-Dest": "document",
            "Upgrade-Insecure-Requests": "1",
        })(`https://m.douban.com/movie/subject/${id}/`)
    ).text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const description = doc.querySelector(".page .card .subject-intro .bd>p")?.textContent?.trim() as string;
    const img = doc.querySelector("#subject-header-container > div.sub-info > a > img")!.getAttribute("src") as string;
    return {
        image: img,
        description: description,
    };
}

export function getNearMovie(date: string) {
    const listData = Storage.get("list") as string;
    const list: DoubanData[] = JSON.parse(listData).list;
    return list
        .filter((item) => dayjs(item.date).isBefore(date))
        .reverse()
        .slice(0, 9);
}
