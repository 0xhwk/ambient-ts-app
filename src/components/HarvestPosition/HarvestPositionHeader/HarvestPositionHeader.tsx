import styles from './HarvestPositionHeader.module.css';
import { BiArrowBack } from 'react-icons/bi';

import { VscClose } from 'react-icons/vsc';
interface HarvestPositionHeaderPropsIF {
    title: string;
    onClose: () => void;
    onBackButton: () => void;
    showBackButton: boolean;
}
export default function HarvestPositionHeader(
    props: HarvestPositionHeaderPropsIF,
) {
    return (
        <header className={styles.header_container}>
            {props.showBackButton ? (
                <BiArrowBack
                    size={22}
                    onClick={() => props.onBackButton()}
                    role='button'
                    tabIndex={0}
                    aria-label='Go back button'
                />
            ) : (
                <div />
            )}
            <h2>{props.title}</h2>
            <VscClose
                size={22}
                onClick={props.onClose}
                role='button'
                tabIndex={0}
                aria-label='Close modal button'
            />
        </header>
    );
}
