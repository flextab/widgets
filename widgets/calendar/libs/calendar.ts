import dayjs from "dayjs";
import type LunarUtilsType from "lunar";
// @ts-ignore
import * as _LunarUtils from "lunar";

const LunarUtils: typeof LunarUtilsType = _LunarUtils as any;
const YearSymbolList = Array.from("🐁🐂🐅🐇🐉🐍🐎🐐🐒🐓🐕🐖");
const XingzuoSymbolList = Array.from("♈♉♊♋♌♍♎♏♐♑♒♓⛎");

interface DayInfo {
    year: number;
    month: number;
    date: number;
    week: number;
    weekName: string;
    lunarYear: string;
    lunarMonth: string;
    lunarDay: string;
    solarTerm?: string;
    festival?: string[];
    isHoliday: boolean;
    isWork: boolean;
    isRest: boolean;
    yearSymbol: string;
    yearAnimalName: string;
    lunarFullDateString: string;
    yearGanzhiName: string;
    xingzuoSymbol: string;
    xingzuoName: string;
    dayAllowText: string;
    dayForbidText: string;
}

export class Calendar {
    days: DayInfo[] = [];

    weeks: string[] = [];

    constructor(public year?: number, public month?: number, public date?: number) {
        const now = dayjs();
        if (!year) {
            this.year = now.year();
        }
        if (!month) {
            this.month = now.month() + 1;
        }
        if (!date) {
            this.date = now.date();
        }
        const nowWeek = now.clone().startOf("week");
        for (let i = 0; i < 7; i++) {
            this.weeks.push(nowWeek.clone().add(i, "day").format("dd"));
        }
        this.generateDays();
    }

    get currentDay() {
        return this.formatDate(new Date(this.year!, this.month! - 1, this.date));
    }

    get today() {
        return this.formatDate(new Date());
    }

    get isToday() {
        const now = dayjs();
        return now.year() === this.year && now.month() + 1 === this.month && now.date() === this.date;
    }

    static getCalandar(date: string | Date) {
        const data = dayjs(date);
        return new Calendar(data.year(), data.month() + 1, data.date());
    }

    generateDays() {
        const currentDay = dayjs(new Date(this.year!, this.month! - 1, this.date));
        let start = currentDay.clone().startOf("month").startOf("week");
        const end = currentDay.clone().endOf("month").endOf("week");
        this.days.length = 0;
        const days = end.clone().diff(start, "day");
        for (let i = 0; i < days; i++) {
            this.days.push(this.formatDate(start.toDate()));
            start = start.add(1, "day");
        }
    }

    formatDate(date: Date) {
        const d = dayjs(date);
        const lunar = LunarUtils.Lunar.fromDate(d.toDate());
        const solar = LunarUtils.Solar.fromDate(d.toDate());
        const xingzuoIndex = LunarUtils.SolarUtil.XINGZUO.indexOf(solar.getXingZuo());
        const holiday = LunarUtils.HolidayUtil.getHoliday(d.year(), d.month() + 1, d.date());
        const info: DayInfo = {
            year: d.year(),
            month: d.month() + 1,
            date: d.date(),
            week: d.weekday() + 1,
            weekName: d.format("ddd"),
            // 农历日期
            lunarYear: lunar.getYearInChinese(),
            lunarMonth: lunar.getMonthInChinese(),
            lunarDay: lunar.getDayInChinese(),
            lunarFullDateString: `${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
            // 二十四节气
            solarTerm: lunar.getJieQi(),
            festival: [lunar.getFestivals(), solar.getFestivals()].flat().filter(Boolean),
            isHoliday: !!holiday && !holiday?.isWork(),
            isRest: (!!holiday || d.weekday() === 5 || d.weekday() === 6) && !holiday?.isWork(),
            isWork: !!holiday && holiday.isWork(),
            yearSymbol: YearSymbolList[lunar.getYearZhiIndex()],
            yearAnimalName: lunar.getYearShengXiao(),
            yearGanzhiName: lunar.getYearInGanZhi(),
            xingzuoSymbol: XingzuoSymbolList[xingzuoIndex],
            xingzuoName: solar.getXingZuo(),

            dayAllowText: lunar.getDayYi().join("、"),
            dayForbidText: lunar.getDayJi().join("、"),
        };
        return info;
    }

    getNextHoliday() {
        const holiday = LunarUtils.HolidayUtil.getHoliday(this.year!, this.month, this.date);
        const holidays = [...LunarUtils.HolidayUtil.getHolidays(this.year!), ...LunarUtils.HolidayUtil.getHolidays(this.year! + 1)].filter(
            (h) => {
                if (holiday) {
                    if (h.getTarget() === holiday.getTarget()) {
                        return false;
                    }
                }
                return dayjs(h.getDay()).isAfter(dayjs(new Date(this.year!, this.month! - 1, this.date)));
            }
        );
        return holidays.length
            ? `距离${holidays[0].getName()}还有${dayjs(holidays[0].getDay()).diff(
                  dayjs(new Date(this.year!, this.month! - 1, this.date)),
                  "day"
              )}天`
            : "";
    }

    getNextJieqi() {
        const jieqi = LunarUtils.Lunar.fromDate(new Date(this.year!, this.month! - 1, this.date)).getNextJieQi();
        const name = jieqi.getName();
        const days = dayjs(jieqi.getSolar().toYmd()).diff(dayjs(new Date(this.year!, this.month! - 1, this.date)), "day");
        return `距离${name}还有${days}天`;
    }
}
