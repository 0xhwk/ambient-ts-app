import styles from './Toggle.module.css';

interface ToggleProps {
    isOn: boolean;
    onColor?: string;
    Width?: boolean | number;
    id: string;
    handleToggle: React.ChangeEventHandler<HTMLElement>;
}
export default function Toggle(props: ToggleProps) {
    const { isOn, handleToggle, onColor, Width, id } = props;

    const labelStyle = Width ? `${Width}px` : '100px';
    const labelHeight = `${parseInt(labelStyle) / 2}px`;
    const buttonStyle = labelStyle ? `${parseInt(labelStyle) / 2 - 5}px` : '45px';
    const onColorStyle = onColor
        ? onColor
        : 'linear-gradient(90deg, #AF99FF 0%, #46B7DB 49.48%, #F13D70 100%)';

    return (
        <div>
            <input
                checked={isOn}
                onChange={handleToggle}
                className={styles.switch_checkbox}
                id={`${id}switch`}
                type='checkbox'
            />
            <label
                style={{
                    background: isOn ? onColorStyle : 'transparent',
                    width: labelStyle,
                    height: labelHeight,
                }}
                className={styles.switch_label}
                htmlFor={`${id}switch`}
            >
                <span
                    className={styles.switch_button}
                    style={{ width: buttonStyle, height: buttonStyle }}
                />
            </label>
        </div>
    );
}