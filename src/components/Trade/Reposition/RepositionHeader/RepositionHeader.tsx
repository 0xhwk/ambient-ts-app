// START: Import React and Dongles
import { Dispatch, memo, SetStateAction, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import settingsIcon from '../../../../assets/images/icons/settings.svg';
import { VscClose } from 'react-icons/vsc';

// START: Import JSX Components
import ContentHeader from '../../../Global/ContentHeader/ContentHeader';
import TransactionSettings from '../../../Global/TransactionSettings/TransactionSettings';

// START: Import Local Files
import styles from './RepositionHeader.module.css';
import trimString from '../../../../utils/functions/trimString';
import { useRepoExitPath } from './useRepoExitPath';
import { setAdvancedMode } from '../../../../utils/state/tradeDataSlice';
import { useAppDispatch } from '../../../../utils/hooks/reduxToolkit';
import { UserPreferenceContext } from '../../../../contexts/UserPreferenceContext';
import { RangeContext } from '../../../../contexts/RangeContext';
import { AppStateContext } from '../../../../contexts/AppStateContext';

interface propsIF {
    positionHash: string;
    setRangeWidthPercentage: Dispatch<SetStateAction<number>>;
    resetTxHash: () => void;
}

function RepositionHeader(props: propsIF) {
    const { setRangeWidthPercentage, positionHash, resetTxHash } = props;

    const { setSimpleRangeWidth, setCurrentRangeInReposition } =
        useContext(RangeContext);
    const { bypassConfirmRepo, repoSlippage } = useContext(
        UserPreferenceContext,
    );

    const {
        globalModal: { open: openGlobalModal, close: closeGlobalModal },
    } = useContext(AppStateContext);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // navpath for when user clicks the exit button
    const exitPath = useRepoExitPath();

    const transactionSettingsModalContent = (
        <TransactionSettings
            module='Reposition'
            slippage={repoSlippage}
            onClose={closeGlobalModal}
            bypassConfirm={bypassConfirmRepo}
        />
    );

    return (
        <ContentHeader>
            <img
                className={styles.settings_icon}
                src={settingsIcon}
                alt='settings'
                onClick={() => openGlobalModal(transactionSettingsModalContent)}
            />
            <p className={styles.title}>
                {' '}
                Reposition: {trimString(positionHash, 5, 4, '…')}
            </p>
            <VscClose
                className={styles.close_icon}
                onClick={() => {
                    dispatch(setAdvancedMode(false));
                    setRangeWidthPercentage(10);
                    setSimpleRangeWidth(10);
                    navigate(exitPath, { replace: true });
                    resetTxHash();
                    setCurrentRangeInReposition('');
                }}
            />
        </ContentHeader>
    );
}

export default memo(RepositionHeader);
