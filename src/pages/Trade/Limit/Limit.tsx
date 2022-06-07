// START: Import React and Dongles
import { useMoralis } from 'react-moralis';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

import { sortBaseQuoteTokens, getSpotPriceDisplay, POOL_PRIMARY } from '@crocswap-libs/sdk';

// START: Import React Functional Components
import ContentContainer from '../../../components/Global/ContentContainer/ContentContainer';
import LimitButton from '../../../components/Trade/Limit/LimitButton/LimitButton';
import LimitCurrencyConverter from '../../../components/Trade/Limit/LimitCurrencyConverter/LimitCurrencyConverter';
import DenominationSwitch from '../../../components/Swap/DenominationSwitch/DenominationSwitch';
import LimitExtraInfo from '../../../components/Trade/Limit/LimitExtraInfo/LimitExtraInfo';
import LimitHeader from '../../../components/Trade/Limit/LimitHeader/LimitHeader';
import DividerDark from '../../../components/Global/DividerDark/DividerDark';
import Modal from '../../../components/Global/Modal/Modal';
import ConfirmLimitModal from '../../../components/Trade/Limit/ConfirmLimitModal/ConfirmLimitModal';
import { JsonRpcProvider } from '@ethersproject/providers';

// START: Import Local Files
import { useTradeData } from '../Trade';
import { getCurrentTokens, findTokenByAddress } from '../../../utils/functions/processTokens';
import { kovanETH, kovanUSDC } from '../../../utils/data/defaultTokens';
import { useModal } from '../../../components/Global/Modal/useModal';

interface ILimitProps {
    provider: JsonRpcProvider;
    isOnTradeRoute?: boolean;
    gasPriceinGwei: string;
    nativeBalance: string;
    lastBlockNumber: number;
}

export default function Limit(props: ILimitProps) {
    const {
        provider,
        // isOnTradeRoute,
        lastBlockNumber,
        //  nativeBalance,
        //  gasPriceinGwei
    } = props;

    const { tradeData } = useTradeData();
    const [isModalOpen, openModal, closeModal] = useModal();
    const [limitAllowed, setLimitAllowed] = useState<boolean>(false);

    // TODO:  @Emily the logic below to get token pair data was ported from Swap.tsx and
    // TODO:  ... will need to be repeated in Range.tsx per the current architecture, we
    // TODO:  ... should refactor this to have less redundancy in code and app processes

    const { chainId } = useMoralis();
    // get current tokens for the active chain
    // if called before Moralis can initialize use kovan
    const tokensBank = getCurrentTokens(chainId ?? '0x2a');

    const tokenPair = {
        dataTokenA: findTokenByAddress(tradeData.addressTokenA, tokensBank) ?? kovanETH,
        dataTokenB: findTokenByAddress(tradeData.addressTokenB, tokensBank) ?? kovanUSDC,
    };

    const confirmLimitModalOrNull = isModalOpen ? (
        <Modal onClose={closeModal} title='Limit Confirmation'>
            <ConfirmLimitModal onClose={closeModal} tokenPair={tokenPair} />
        </Modal>
    ) : null;

    const [poolPriceDisplay, setPoolPriceDisplay] = useState(0);

    const [baseTokenAddress, setBaseTokenAddress] = useState<string>('');
    const [quoteTokenAddress, setQuoteTokenAddress] = useState<string>('');

    const [isSellTokenBase, setIsSellTokenBase] = useState<boolean>(true);

    // useEffect to set baseTokenAddress and quoteTokenAddress when pair changes
    useEffect(() => {
        if (tokenPair.dataTokenA.address && tokenPair.dataTokenB.address) {
            const sortedTokens = sortBaseQuoteTokens(
                tokenPair.dataTokenA.address,
                tokenPair.dataTokenB.address,
            );
            setBaseTokenAddress(sortedTokens[0]);
            setQuoteTokenAddress(sortedTokens[1]);
            if (tokenPair.dataTokenA.address === sortedTokens[0]) {
                setIsSellTokenBase(true);
            } else {
                setIsSellTokenBase(false);
            }
        }
    }, [JSON.stringify(tokenPair)]);

    // useEffect to get display spot price when tokens change and block updates
    useEffect(() => {
        if (baseTokenAddress && quoteTokenAddress) {
            (async () => {
                const spotPriceDisplay = await getSpotPriceDisplay(
                    baseTokenAddress,
                    quoteTokenAddress,
                    POOL_PRIMARY,
                    provider,
                );
                if (poolPriceDisplay !== spotPriceDisplay) {
                    setPoolPriceDisplay(spotPriceDisplay);
                }
            })();
        }
    }, [lastBlockNumber, baseTokenAddress, quoteTokenAddress]);

    return (
        <motion.section
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            exit={{ x: window.innerWidth, transition: { duration: 0.6 } }}
            data-testid={'limit'}
        >
            <ContentContainer isOnTradeRoute>
                <LimitHeader tokenPair={tokenPair} />
                <DenominationSwitch tokenPair={tokenPair} />
                <DividerDark />
                <LimitCurrencyConverter
                    tokenPair={tokenPair}
                    poolPriceDisplay={poolPriceDisplay}
                    isSellTokenBase={isSellTokenBase}
                    tokensBank={tokensBank}
                    chainId={chainId ?? '0x2a'}
                    setLimitAllowed={setLimitAllowed}
                />
                <LimitExtraInfo tokenPair={tokenPair} />
                <LimitButton onClickFn={openModal} limitAllowed={limitAllowed} />
            </ContentContainer>
            {confirmLimitModalOrNull}
        </motion.section>
    );
}
