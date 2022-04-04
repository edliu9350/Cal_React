import { render } from "@testing-library/react";
import App from "../App";
import Button from "../components/Button/Button";
import ButtonPanel from "../components/ButtonPanel";
import Display from "../components/Display";
import { mount } from "enzyme";
import { DOMElement, isValidElement } from "react";
import { act } from "react-dom/test-utils";
import { shallow } from "enzyme";
import axios from "axios";
import { JsxEmit } from "typescript";

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

const testInput = (btnGroup: any, expr: string) => {
    for (let ch of expr) {
        if (ch >= "0" && ch <= "9")
            btnGroup.numBtn[Number(ch)].simulate("click");
        if (ch == "+") btnGroup.plusBtn.simulate("click");
        if (ch == "-") btnGroup.minusBtn.simulate("click");
        if (ch == "x") btnGroup.timesBtn.simulate("click");
        if (ch == "÷") btnGroup.divBtn.simulate("click");
        if (ch == "=") btnGroup.eqBtn.simulate("click");
        if (ch == ".") btnGroup.pointBtn.simulate("click");
        if (ch == "A") btnGroup.acBtn.simulate("click");
        if (ch == "%") btnGroup.percentBtn.simulate("click");
        if (ch == "I") btnGroup.inverseBtn.simulate("click");
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

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.get.mockResolvedValue(3);

describe("tests calculation", () => {
    it("input validation", () => {
        const btnGroup = getButtonGroup();

        testInput(btnGroup, "0..123..456");
        expect(btnGroup.displayBtn.getDOMNode().innerHTML).toEqual("0.123456");

        testInput(btnGroup, "A");

        testInput(btnGroup, "0123456");
        expect(btnGroup.displayBtn.getDOMNode().innerHTML).toEqual("123456");
    });
});
