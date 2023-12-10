import Storage from "local-storage";
import dayjs from "dayjs";

export async function getOneData(): Promise<OneData> {
    if (Storage.get("timestamp") && Storage.get("one")) {
        if (dayjs(Storage.get("timestamp") as number).isToday()) {
            return JSON.parse(Storage.get("one") as string);
        }
    }

    const html = await (await window.corsFetch(`https://wufazhuce.com/`)).text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const pic = doc.querySelector("#carousel-one .carousel-inner .item a")?.getAttribute("href");
    const article = doc.querySelector("#main-container .row.frontpage .fp-one-articulo .one-articulo-titulo a")?.getAttribute("href");
    const question = doc.querySelector("#main-container .row.frontpage .fp-one-cuestion .one-cuestion-titulo a")?.getAttribute("href");
    const htmlArray = await Promise.all([
        window.corsFetch(pic!).then((a) => a.text()),
        window.corsFetch(article!).then((a) => a.text()),
        window.corsFetch(question!).then((a) => a.text()),
    ]);
    const picDom = new DOMParser().parseFromString(htmlArray[0], "text/html");
    const articleDom = new DOMParser().parseFromString(htmlArray[1], "text/html");
    const questionDom = new DOMParser().parseFromString(htmlArray[2], "text/html");

    const oneData: OneData = {
        pic: picDom.querySelector("#main-container .one-imagen img")?.getAttribute("src"),
        description: picDom.querySelector("#main-container .one-cita-wrapper .one-cita")?.textContent?.trim(),
        article: {
            title: articleDom.querySelector("#main-container .one-articulo .articulo-titulo")?.textContent?.trim(),
            author: articleDom.querySelector("#main-container .one-articulo .articulo-autor")?.textContent?.trim(),
            content: articleDom.querySelector("#main-container .one-articulo .articulo-contenido")?.innerHTML.trim(),
            editor: articleDom.querySelector("#main-container .one-articulo .articulo-editor")?.textContent?.trim(),
        },
        question: {
            title: questionDom.querySelector("#main-container .one-cuestion h4")?.textContent?.trim(),
            subtitle: questionDom.querySelector("#main-container .one-cuestion .cuestion-contenido")?.textContent?.trim(),
            content: questionDom.querySelectorAll("#main-container .one-cuestion .cuestion-contenido")[1]?.innerHTML.trim(),
            editor: questionDom.querySelector("#main-container .one-cuestion .cuestion-editor")?.textContent?.trim(),
        },
    } as OneData;

    Storage.set("one", JSON.stringify(oneData));
    Storage.set("timestamp", Date.now());

    return oneData;
}

export interface OneData {
    pic: string;
    description: string;
    article: {
        title: string;
        author: string;
        content: string;
        editor: string;
    };
    question: {
        title: string;
        subtitle: string;
        content: string;
        editor: string;
    };
}
