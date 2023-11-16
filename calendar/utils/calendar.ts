import dayjs from "dayjs";
import lunisolar from "../libs/lunisolar.js";

interface DayInfo {
    year: number;
    month: number;
    date: number;
}

export class Calendar {
    year!: number;
    month!: number;
    date!: number;

    days: DayInfo[] = [];

    constructor() {
        this.moveToday();
    }

    moveToday() {
        const now = dayjs();
        this.year = now.year();
        this.month = now.month() + 1;
        this.date = now.date();
        this.generateDays();
    }

    setDate(year: number, month: number, date: number) {
        this.year = year;
        this.month = month;
        this.date = date;
        this.generateDays();
    }

    generateDays() {
        const currentDay = dayjs(new Date(this.year, this.month - 1, this.date));
        const start = currentDay.startOf("month").startOf("week");
        const end = currentDay.endOf("month").endOf("week");
        this.days.length = 0;
        const days = end.clone().diff(start, "date");
        console.log({ days });
        console.log(2222);
        // for (let i = 0; i < days; i++) {
        //     this.days.push(this.formatDate(start.add(1, "day").toDate()));
        // }
    }

    formatDate(date: Date) {
        const d = dayjs(date);
        const info: DayInfo = {
            year: d.year(),
            month: d.month() + 1,
            date: d.date(),
        };
        return info;
    }
}
