import type * as mathjs from "./math";

export interface CalculatorKey {
    title: string;
    label: string;
    value: string;
}

const calculatorKeys = `
RAD|DEG              AC       +/-    %    ←    ÷
sin         cos      tan      7      8    9    ×
asin        acos     atan     4      5    6    -
π           log      e        1      2    3    +
√           x^y      (        )      0    .    =
`;

export class Calculator {
    input = "";
    formula = "";

    keys: string[] = [];

    private math!: typeof mathjs;

    mode = "DEG";

    constructor() {
        this.input = "";
        this.update();
    }

    installMathJS(math: typeof mathjs) {
        this.math = math;
    }

    update() {
        const keys = calculatorKeys
            .trim()
            .split("\n")
            .map((a) => a.split(" ").filter(Boolean))
            .flat();
        this.keys = keys;
    }

    clearPreResult() {
        if (this.formula || this.input === "Error") {
            this.formula = "";
            this.input = "";
        }
    }

    private getParser() {
        const parser = this.math.parser();
        ["sin", "cos", "tan", "asin", "acos", "atan"].forEach((key) => {
            parser.set(key, (value: number) => {
                if (this.mode === "DEG") {
                    value = (value * Math.PI) / 180;
                }
                return (Math as any)[key](value);
            });
        });
        return parser;
    }

    evaluate() {
        try {
            const parser = this.getParser();
            let result = parser
                .evaluate(
                    this.input.replace(/([×π÷])/g, (str, match) => {
                        return (
                            (
                                {
                                    "×": "*",
                                    "÷": "/",
                                    π: "pi",
                                } as any
                            )[match] || ""
                        );
                    })
                )
                .toString();
            if (result === "Infinity") {
                result = "∞";
            } else if (result === "-Infinity") {
                result = "-∞";
            }
            return result;
        } catch (error) {
            return "Error";
        }
    }

    click(key: string) {
        if (key === "RAD|DEG") {
            this.mode = this.mode === "RAD" ? "DEG" : "RAD";
        } else if (key === "AC") {
            this.formula = "";
            this.input = "";
        } else if (key === "+/-") {
            if (this.formula && this.input && this.input !== "Error") {
                if (this.input.startsWith("-")) {
                    this.input = this.input.slice(1);
                } else {
                    this.input = "-" + this.input;
                }
            } else {
                this.input += "-";
            }
        } else if (key === "←") {
            this.clearPreResult();
            this.input = this.input.slice(0, -1);
        } else if (["sin", "cos", "tan", "asin", "acos", "atan", "log"].includes(key)) {
            if (this.formula && this.input && this.input !== "Error") {
                this.formula = "";
                this.input = `${key}(${this.input})`;
            } else {
                this.clearPreResult();
                this.input += `${key}(`;
            }
        } else if (key === "√") {
            if (this.formula && this.input && this.input !== "Error") {
                this.formula = "";
                this.input = `sqrt(${this.input})`;
            } else {
                this.clearPreResult();
                this.input += `sqrt(`;
            }
        } else if (key === "x^y") {
            if (this.formula && this.input && this.input !== "Error") {
                this.formula = "";
                this.input = `${this.input}^`;
            } else {
                this.clearPreResult();
                this.input += `^`;
            }
        } else if (key === "=") {
            this.formula = this.input;
            this.input = this.evaluate();
        } else {
            if (this.formula && this.input && this.input !== "Error" && "+-×÷".includes(key)) {
                this.formula = "";
            } else {
                this.clearPreResult();
            }
            this.input += key;
        }
    }
}
