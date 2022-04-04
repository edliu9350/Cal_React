import { useState } from "react";
import Display from "../../components/Display";
import ButtonPanel from "../../components/ButtonPanel";
import styles from "./CalculatorView.module.scss";
import {
    requestCalc,
    requestInverse,
    requestPercent,
} from "../../controllers/CalculatorController/CalculatorController";
import axios from "axios";
import { act } from "react-dom/test-utils";

export default () => {
    const [total, setTotal] = useState<string>("0");
    const [next, setNext] = useState<string | null>(null);
    const [operation, setOperation] = useState<string | null>(null);
    const [error, setError] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const clear = () => {
        setTotal("0");
        setNext(null);
        setOperation(null);
    };

    const handleClick = async (name: string): Promise<void> => {
        setError(false);

        if (name == "AC") {
            clear();
            return;
        }
        if (name >= "0" && name <= "9") {
            setNext((next) => (next == "0" || !next ? name : next + name));
            return;
        }
        if (
            name == "+" ||
            name == "-" ||
            name == "x" ||
            name == "÷" ||
            name == "="
        ) {
            let prevOp = operation;
            setOperation(name);
            let res = await requestCalc(total, next, prevOp);
            if (res) {
                setLoading(false);
                setTotal(res.data);
                setNext(null);
            } else {
                setLoading(false);
                setError(true);
                clear();
            }
            return;
        }
        if (name == ".") {
            if (next == null) {
                setNext("0.");
                return;
            }
            if (!next.includes(".")) setNext((next) => next + ".");
            return;
        }
        if (name == "+/-") {
            if (next == null) {
                /*calc request (total = -total) */
                let res = await requestInverse(Number(total));
                if (res) {
                    setLoading(false);
                    setTotal(res.data);
                } else {
                    setLoading(false);
                    setError(true);
                    clear();
                }
            } else if (next != "0") {
                /*calc request (next = -next) */
                setLoading(true);
                let res = await requestInverse(Number(next));
                if (res) {
                    setLoading(false);
                    setNext(res.data);
                } else {
                    setLoading(false);
                    setError(true);
                    clear();
                }
            }
            return;
        }
        if (name == "%") {
            if (next == null) {
                /*calc request (total = 0.01 * total) */
                let res = await requestPercent(Number(total));
                if (res) {
                    setLoading(false);
                    setTotal(res.data);
                } else {
                    setLoading(false);
                    setError(true);
                    clear();
                }
            } else if (next != "0") {
                /*calc request (next = 0.01 * next) */
                let res = await requestPercent(Number(next));
                if (res) {
                    setLoading(false);
                    setNext(res.data);
                } else {
                    setLoading(false);
                    setError(true);
                    clear();
                }
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>Calculator</div>
            <Display value={error ? "Error occured" : String(next || total)} />
            <ButtonPanel clickHandler={handleClick} />
        </div>
    );
};
