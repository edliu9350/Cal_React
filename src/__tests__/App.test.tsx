import { render } from "@testing-library/react";
import App from "../App";
import Button from "../components/Button/Button";
import ButtonPanel from "../components/ButtonPanel";
import Display from "../components/Display";
import { mount } from "enzyme";
import axios from "axios";
import { waitFor } from "@testing-library/react";
var Big = require("big.js");

describe("<App />", () => {
    it("renders main app without crashing", () => {
        render(<App />);
    });
});

describe("<ButtonPanel />", () => {
    it("renders panel without crashing", () => {
        const clickHandler = (name: string): void => {};
        render(<ButtonPanel clickHandler={clickHandler} />);
    });
});

describe("<Button />", () => {
    it("renders button without crashing", () => {
        const clickHandler = (name: string): void => {};

        render(<Button clickHandler={clickHandler} name="1" />);
    });
});

describe("<Display />", () => {
    it("renders display without crashing", () => {
        render(<Display value="0" />);
    });
});

const testInput = async (btnGroup: any, expr: string) => {
    for (let ch of expr) {
        if (ch >= "0" && ch <= "9") {
            btnGroup.numBtn[Number(ch)].simulate("click");
        }
        if (ch == "+") await btnGroup.plusBtn.simulate("click");
        if (ch == "-") await btnGroup.minusBtn.simulate("click");
        if (ch == "x") await btnGroup.timesBtn.simulate("click");
        if (ch == "÷") await btnGroup.divBtn.simulate("click");
        if (ch == "=") await btnGroup.eqBtn.simulate("click");
        if (ch == ".") btnGroup.pointBtn.simulate("click");
        if (ch == "A") btnGroup.acBtn.simulate("click");
        if (ch == "%") await btnGroup.percentBtn.simulate("click");
        if (ch == "I") await btnGroup.inverseBtn.simulate("click");
    }
};

const getButtonGroup = () => {
    const app = mount(<App />);
    const displayBtn = app.find("#display");
    const plusBtn = app.find("[id='btn-+']");
    const minusBtn = app.find("[id='btn--']");
    const timesBtn = app.find("[id='btn-x']");
    const divBtn = app.find("[id='btn-÷']");
    const eqBtn = app.find("[id='btn-=']");
    const acBtn = app.find("#btn-AC");
    const pointBtn = app.find("[id='btn-.']");
    const percentBtn = app.find("[id='btn-%']");
    const inverseBtn = app.find("[id='btn-+/-']");
    const numBtn = Array(10);
    for (let i = 0; i < 10; i++) numBtn[i] = app.find(`#btn-${i}`);
    return {
        displayBtn,
        plusBtn,
        minusBtn,
        timesBtn,
        divBtn,
        eqBtn,
        acBtn,
        pointBtn,
        numBtn,
        percentBtn,
        inverseBtn,
    };
};

const getMockedAxios = () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.get.mockImplementation((url) => {
        const searchParams = new URLSearchParams(
            url.slice(url.indexOf("?") + 1)
        );
        if (searchParams == null) return Promise.reject();

        let operation = searchParams.get("operation");
        let total = searchParams.get("total");
        let next = searchParams.get("next");
        let num = searchParams.get("num");
        let rlt;

        let totalNum = isNaN(Number(total)) ? null : Big(Number(total));
        let nextNum = isNaN(Number(next)) ? null : Big(Number(next));
        num = isNaN(Number(num)) ? Big("0") : Big(Number(num));

        if (url.includes("inverse")) rlt = Big(num!).times(-1);
        else if (url.includes("percent")) rlt = Big(num!).times(0.01);
        else if (nextNum == null) {
            rlt = totalNum ? totalNum : "0";
        } else {
            switch (operation) {
                case "plus":
                    rlt = totalNum.plus(nextNum);
                    break;
                case "minus":
                    rlt = totalNum.minus(nextNum);
                    break;
                case "times":
                    rlt = totalNum.times(nextNum);
                    break;
                case "divide":
                    rlt = totalNum.div(nextNum);
                    break;
                default: {
                    rlt = nextNum;
                }
            }
        }
        rlt = String(rlt);

        return Promise.resolve({
            data: rlt,
        });
    });
    return mockedAxios;
};

jest.mock("axios");

describe("tests calculation", () => {
    it("input validation", () => {
        const btnGroup = getButtonGroup();

        testInput(btnGroup, "0..123..456");
        expect(btnGroup.displayBtn.getDOMNode().innerHTML).toEqual("0.123456");

        testInput(btnGroup, "A");

        testInput(btnGroup, "0123456");
        expect(btnGroup.displayBtn.getDOMNode().innerHTML).toEqual("123456");
    });

    it("test plus", async () => {
        const btnGroup = getButtonGroup();
        const mockedAxios = getMockedAxios();

        testInput(btnGroup, "1234+=");
        await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(2));
        expect(btnGroup.displayBtn.getDOMNode().innerHTML).toEqual("1234");

        testInput(btnGroup, "1234+45+50=");
        await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(5));
        expect(btnGroup.displayBtn.getDOMNode().innerHTML).toEqual("1329");

        testInput(btnGroup, "1234+45+50=");
        await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(8));
        expect(btnGroup.displayBtn.getDOMNode().innerHTML).toEqual("1329");
    });

    it("test minus", async () => {
        const btnGroup = getButtonGroup();
        const mockedAxios = getMockedAxios();

        testInput(btnGroup, "1234-=");
        await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(2));
        expect(btnGroup.displayBtn.getDOMNode().innerHTML).toEqual("1234");

        testInput(btnGroup, "1234-45-50=");
        await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(5));
        expect(btnGroup.displayBtn.getDOMNode().innerHTML).toEqual("1139");

        testInput(btnGroup, "1234-45-50");
        await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(7));
        expect(btnGroup.displayBtn.getDOMNode().innerHTML).toEqual("50");
    });

    it("test times", async () => {
        const btnGroup = getButtonGroup();
        const mockedAxios = getMockedAxios();

        testInput(btnGroup, "1234x=");
        await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(2));
        expect(btnGroup.displayBtn.getDOMNode().innerHTML).toEqual("1234");

        testInput(btnGroup, "1234x45x50=");
        await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(5));
        expect(btnGroup.displayBtn.getDOMNode().innerHTML).toEqual("2776500");

        testInput(btnGroup, "1234x45x50");
        await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(7));
        expect(btnGroup.displayBtn.getDOMNode().innerHTML).toEqual("50");
    });

    it("test divide", async () => {
        const btnGroup = getButtonGroup();
        const mockedAxios = getMockedAxios();

        testInput(btnGroup, "108÷=");
        await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(2));
        expect(btnGroup.displayBtn.getDOMNode().innerHTML).toEqual("108");

        testInput(btnGroup, "108÷2÷3=");
        await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(5));
        expect(btnGroup.displayBtn.getDOMNode().innerHTML).toEqual("18");

        testInput(btnGroup, "108÷2÷3");
        await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(7));
        expect(btnGroup.displayBtn.getDOMNode().innerHTML).toEqual("3");
    });

    it("test percent", async () => {
        const btnGroup = getButtonGroup();
        const mockedAxios = getMockedAxios();

        testInput(btnGroup, "108%+3=");
        await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(3));
        expect(btnGroup.displayBtn.getDOMNode().innerHTML).toEqual("4.08");
    });

    it("test inverse", async () => {
        const btnGroup = getButtonGroup();
        const mockedAxios = getMockedAxios();

        testInput(btnGroup, "108I");
        await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));
        expect(btnGroup.displayBtn.getDOMNode().innerHTML).toEqual("-108");
    });

    it("test clear", async () => {
        const btnGroup = getButtonGroup();
        const mockedAxios = getMockedAxios();

        testInput(btnGroup, "108A");
        expect(btnGroup.displayBtn.getDOMNode().innerHTML).toEqual("0");
    });
});
