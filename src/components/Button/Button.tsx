import styles from "./Button.module.scss";

interface ButtonProps {
    clickHandler(name: string): void;
    name: string;
    orange?: boolean;
    wide?: boolean;
}

export default ({
    clickHandler,
    name,
    orange,
    wide,
    ...props
}: ButtonProps) => {
    const className = `${styles["component-button"]} ${
        orange && styles["orange"]
    } ${wide && styles["wide"]}`;
    const handleClick = () => {
        clickHandler(name);
    };

    return (
        <div className={className}>
            <button id={`btn-${name}`} onClick={handleClick} {...props}>
                {name}
            </button>
        </div>
    );
};
