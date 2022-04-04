import styles from "./Display.module.scss";

interface DisplayProps {
    value: string;
}

export default ({ value }: DisplayProps) => {
    return (
        <div className={styles["component-display"]}>
            <div id={"display"}>{value}</div>
        </div>
    );
};
