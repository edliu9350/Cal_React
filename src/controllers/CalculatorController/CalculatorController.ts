import axios from "axios";

const BASE_URL = "http://localhost:5000";

const requestInverse = (num: number): Promise<any> => {
    return axios.get(`${BASE_URL}/api/calc/inverse?num=${num}`);
};

const requestPercent = (num: number): Promise<any> => {
    return axios.get(`${BASE_URL}/api/calc/percent?num=${num}`);
};

const requestCalc = (
    total: string,
    next: string | null,
    operation: string | null
): Promise<any> => {
    const opMap: any = {
        null: null,
        "+": "plus",
        "-": "minus",
        x: "times",
        "÷": "divide",
        "=": "equal",
    };
    return axios.get(
        `${BASE_URL}/api/calc/main?total=${total}&next=${next}&operation=${
            operation && opMap[operation]
        }`
    );
};

export { requestInverse, requestPercent, requestCalc };
