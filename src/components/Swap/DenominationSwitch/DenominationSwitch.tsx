// START: Import Local Files
import styles from './DenominationSwitch.module.css';
import { TokenPairIF } from '../../../utils/interfaces/exports';
import { useAppDispatch } from '../../../utils/hooks/reduxToolkit';
import { toggleDidUserFlipDenom } from '../../../utils/state/tradeDataSlice';

// interface for props
interface denominationSwitchPropsIF {
    tokenPair: TokenPairIF;
    displayForBase: boolean;
    poolPriceDisplay: number | undefined;
    isOnTradeRoute?: boolean;
    isTokenABase: boolean;
    didUserFlipDenom: boolean;
}

// TODO:  @Emily poolPriceDisplay is passed here as a prop for the purpose of managing
// TODO:  ... which token to initialize the display too, if it's not necessary in the
// TODO   ... end, please remove the value from props

export default function DenominationSwitch(props: denominationSwitchPropsIF) {
    const { tokenPair, isTokenABase, poolPriceDisplay, didUserFlipDenom } = props;

    const dispatch = useAppDispatch();

    // TODO:  @Junior, if both buttons have the same action of reversing the current
    // TODO:  ... value of `toggleDenomination`, let's do just one button with two
    // TODO   ... <div> elements nested inside of it

    const moreExpensiveToken =
        poolPriceDisplay && poolPriceDisplay < 1
            ? isTokenABase
                ? 'A'
                : 'B'
            : isTokenABase
            ? 'B'
            : 'A';

    const tokenToHighlight =
        moreExpensiveToken === 'A' ? (didUserFlipDenom ? 'B' : 'A') : didUserFlipDenom ? 'A' : 'B';

    return (
        <div className={styles.denomination_switch}>
            {/* <div>Denomination</div> */}
            <button
                className={
                    tokenToHighlight === 'A' ? styles.active_button : styles.non_active_button
                }
                onClick={() => dispatch(toggleDidUserFlipDenom())}
            >
                {tokenPair.dataTokenA.symbol}
            </button>
            <button
                className={
                    tokenToHighlight === 'B' ? styles.active_button : styles.non_active_button
                }
                onClick={() => dispatch(toggleDidUserFlipDenom())}
            >
                {tokenPair.dataTokenB.symbol}
            </button>
        </div>
    );
}
