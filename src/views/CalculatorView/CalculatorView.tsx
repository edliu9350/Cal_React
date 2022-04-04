import { useState } from "react";
import Display from "../../components/Display";
import ButtonPanel from "../../components/ButtonPanel";
import styles from "./CalculatorView.module.scss";
import {
    requestCalc,
    requestInverse,
} from "../../controllers/CalculatorController/CalculatorController";
import axios from "axios";

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
            let res = await requestCalc(total, next, operation);
            if (res) {
                setLoading(false);
                setTotal(res.data);
                setOperation(name);
                setNext(null);
            }
            // requestCalc(total, next, operation)
            //     .then((res) => {
            //         setLoading(false);
            //         setTotal(res.data);

            //         setOperation(name);
            //         setNext(null);
            //     })
            //     .catch((err) => {
            //         setLoading(false);
            //         setError(true);

            //         clear();
            //     });
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
                setLoading(true);
                requestInverse(Number(total))
                    .then((res) => {
                        setLoading(false);
                        setTotal(res.data);
                    })
                    .catch((err) => {
                        setLoading(false);
                        setError(true);

                        clear();
                    });
            } else if (next != "0") {
                /*calc request (next = -next) */
                setLoading(true);
                requestInverse(Number(next))
                    .then((res) => {
                        setLoading(false);
                        setNext(res.data);
                    })
                    .catch((err) => {
                        setLoading(false);
                        setError(true);

                        clear();
                    });
            }
            return;
        }
        if (name == "%") {
            if (next == null) {
                /*calc request (total = 0.01 * total) */
                setTotal((total) => String(0.01 * Number(total)));
            } else if (next != "0") {
                /*calc request (next = 0.01 * next) */
                setNext((next) => String(0.01 * Number(next)));
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
