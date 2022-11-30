import { ChainSpec } from '@crocswap-libs/sdk';
import { useEffect, useState } from 'react';
import { memoizePoolStats } from '../../../../App/functions/getPoolStats';
import { useAppSelector } from '../../../../utils/hooks/reduxToolkit';
import { formatAmountOld } from '../../../../utils/numbers';
import styles from './PoolInfo.module.css';
import { BsArrowUpRight } from 'react-icons/bs';
import trimString from '../../../../utils/functions/trimString';
import { DefaultTooltip } from '../../../Global/StyledTooltip/StyledTooltip';
import { ZERO_ADDRESS } from '../../../../constants';
import { motion, AnimateSharedLayout } from 'framer-motion';
import useMediaQuery from '../../../../utils/hooks/useMediaQuery';
// interface for props
interface PoolInfoPropsIF {
    chainData: ChainSpec;
    lastBlockNumber: number;
    showSidebar: boolean;
}
interface PoolInfoCardPropsIF {
    // eslint-disable-next-line
    title: any;
    // eslint-disable-next-line
    data: any;
}
interface timeDataCardPropsIF {
    txs: number;
    buys: number;
    sells: number;
    volume: number;
    smallScreen: boolean;
}

const cachedPoolStatsFetch = memoizePoolStats();

// react functional component
export default function PoolInfo(props: PoolInfoPropsIF) {
    // pool info card--------------------

    // const aprTitle = (
    //     <p>
    //         Avg. APR
    //         <BsStars color='#d4af37' />
    //     </p>
    // );

    // allow a local environment variable to be defined in [app_repo]/.env.local to turn off connections to the cache server
    const isServerEnabled =
        process.env.REACT_APP_CACHE_SERVER_IS_ENABLED !== undefined
            ? process.env.REACT_APP_CACHE_SERVER_IS_ENABLED === 'true'
            : true;

    function PoolInfoCard(props: PoolInfoCardPropsIF) {
        return (
            <DefaultTooltip
                interactive
                title={
                    props.title === 'TVL:'
                        ? 'Total value of all tokens currently locked in the pool.'
                        : props.title === '24h Fees:'
                        ? 'Sum of fees generated by swaps in the last 24 hours.'
                        : props.title === '24h Swap Volume:'
                        ? 'Sum of USD equivalent value of all swaps in the last 24 hours.'
                        : props.title?.props?.children?.includes('Avg. APR')
                        ? 'Average Annual Percentage Rate for all positions in the pool.'
                        : ''
                }
                placement={'bottom'}
                arrow
                enterDelay={400}
                leaveDelay={200}
            >
                <div className={styles.card_container}>
                    <p className={styles.title}>{props.title}</p>
                    <h4 className={styles.info}>{props.data}</h4>
                </div>
            </DefaultTooltip>
        );
    }

    // end of pool info card--------------------

    // time data card---------------------------

    function TimeDataCard(props: timeDataCardPropsIF) {
        const { txs, buys, sells, volume, smallScreen } = props;

        return (
            <div
                className={`${styles.time_display} ${
                    smallScreen ? styles.small_screen : styles.large_screen
                }`}
            >
                <div className={styles.time_display_content}>
                    <p>TXS</p>
                    <h6> {txs}</h6>
                </div>
                <div className={styles.time_display_content}>
                    <p>Buys</p>
                    <h6>{buys}</h6>
                </div>
                <div className={styles.time_display_content}>
                    <p>Sells</p>
                    <h6>{sells}</h6>
                </div>
                <div className={styles.time_display_content}>
                    <p>Volume</p>
                    <h6>{volume}</h6>
                </div>
            </div>
        );
    }

    // end of time data card---------------------------

    const { chainData, lastBlockNumber } = props;

    const tradeData = useAppSelector((state) => state.tradeData);

    const baseTokenAddress = tradeData.baseToken.address;
    const quoteTokenAddress = tradeData.quoteToken.address;
    const baseTokenSymbol = tradeData.baseToken.symbol;
    const quoteTokenSymbol = tradeData.quoteToken.symbol;
    const baseTokenlogo = tradeData.baseToken.logoURI;
    const quoteTokenlogo = tradeData.quoteToken.logoURI;
    const baseTokenName = tradeData.baseToken.name;
    const quoteTokenName = tradeData.quoteToken.name;

    const [poolVolume, setPoolVolume] = useState<string | undefined>();
    const [poolTvl, setPoolTvl] = useState<string | undefined>();
    const [poolFees, setPoolFees] = useState<string | undefined>();
    // eslint-disable-next-line
    const [poolAPR, setPoolAPR] = useState<string | undefined>();

    useEffect(() => {
        setPoolVolume(undefined);
        setPoolTvl(undefined);
        setPoolFees(undefined);
        setPoolAPR(undefined);
    }, [
        JSON.stringify({ base: tradeData.baseToken.address, quote: tradeData.quoteToken.address }),
    ]);

    const fetchPoolStats = () => {
        (async () => {
            const poolStatsFresh = await cachedPoolStatsFetch(
                chainData.chainId.toString(),
                baseTokenAddress,
                quoteTokenAddress,
                chainData.poolIndex,
                Math.floor(lastBlockNumber / 4),
            );
            const volume = poolStatsFresh?.volume;
            const volumeString = volume ? '$' + formatAmountOld(volume) : undefined;
            setPoolVolume(volumeString);
            const tvl = poolStatsFresh?.tvl;
            const tvlString = tvl ? '$' + formatAmountOld(tvl) : undefined;
            setPoolTvl(tvlString);
            const fees = poolStatsFresh?.fees;
            const feesString = fees ? '$' + formatAmountOld(fees) : undefined;
            setPoolFees(feesString);
            const apr = poolStatsFresh?.apy;
            const aprString = apr ? formatAmountOld(apr) + '%' : undefined;
            setPoolAPR(aprString);
        })();
    };

    useEffect(() => {
        if (isServerEnabled) fetchPoolStats();
    }, [
        isServerEnabled,
        lastBlockNumber,
        JSON.stringify({ base: tradeData.baseToken.address, quote: tradeData.quoteToken.address }),
    ]);
    const truncatedBaseAddress = trimString(baseTokenAddress, 6, 0, '…');
    const truncatedQuoteAddress = trimString(quoteTokenAddress, 6, 0, '…');

    const baseAddressWithTooltip = (
        <DefaultTooltip
            interactive
            title={
                <div>
                    <p>{baseTokenAddress}</p>
                </div>
            }
            placement={'right'}
            arrow
            enterDelay={400}
            leaveDelay={200}
        >
            <p>{truncatedBaseAddress}</p>
        </DefaultTooltip>
    );
    const quoteAdressWithTooltip = (
        <DefaultTooltip
            interactive
            title={
                <div>
                    <p>{quoteTokenAddress}</p>
                </div>
            }
            placement={'right'}
            arrow
            enterDelay={400}
            leaveDelay={200}
        >
            <p>{truncatedQuoteAddress}</p>
        </DefaultTooltip>
    );

    const baseTokenDisplay = (
        <section className={styles.token_display_container}>
            <div className={styles.token_info}>
                <img src={baseTokenlogo} alt={baseTokenSymbol} />
                <h3>{baseTokenSymbol}</h3>
                <p>{baseTokenName}</p>
            </div>
            <a
                target='_blank'
                rel='noreferrer'
                href={
                    baseTokenAddress === ZERO_ADDRESS
                        ? 'https://goerli.etherscan.io/address/0xfafcd1f5530827e7398b6d3c509f450b1b24a209'
                        : `https://goerli.etherscan.io/token/${baseTokenAddress}`
                }
                style={{ display: 'flex', gap: '4px' }}
            >
                <p> {baseAddressWithTooltip}</p>
                <BsArrowUpRight size={10} />
            </a>
            <p>Balance</p>
            <h3>169.00</h3>
            <p>Value</p>
            <h3>$420,000</h3>
        </section>
    );
    const quoteTokenDisplay = (
        <section className={styles.token_display_container}>
            <div className={styles.token_info}>
                <img src={quoteTokenlogo} alt={quoteTokenSymbol} />
                <h3>{quoteTokenSymbol}</h3>
                <p>{quoteTokenName}</p>
            </div>
            <a
                target='_blank'
                rel='noreferrer'
                href={`https://goerli.etherscan.io/token/${quoteTokenAddress}`}
                style={{ display: 'flex', gap: '4px' }}
            >
                <p> {quoteAdressWithTooltip}</p>
                <BsArrowUpRight size={10} />
            </a>
            <p>Balance</p>
            <h3>169.00</h3>
            <p>Value</p>
            <h3>$420,000</h3>
        </section>
    );
    const smallScreen = useMediaQuery('(max-width: 1600px)') && props.showSidebar;
    // ||
    // useMediaQuery('(max-width: 1300px)');

    const timeTabData = [
        {
            label: '5m',
            content: (
                <TimeDataCard txs={23} buys={23} sells={23} volume={23} smallScreen={smallScreen} />
            ),
        },
        {
            label: '1h',
            content: (
                <TimeDataCard txs={24} buys={24} sells={24} volume={24} smallScreen={smallScreen} />
            ),
        },
        {
            label: '4h',
            content: (
                <TimeDataCard txs={25} buys={25} sells={25} volume={25} smallScreen={smallScreen} />
            ),
        },
        {
            label: '24h',
            content: (
                <TimeDataCard txs={26} buys={26} sells={26} volume={26} smallScreen={smallScreen} />
            ),
        },
    ];
    const [selectedTab, setSelectedTab] = useState(timeTabData[0]);

    const timeTabDisplay = (
        <div className={`${styles.time_tab_container} `}>
            <nav>
                <ul className={smallScreen ? styles.small_screen : styles.large_screen}>
                    {timeTabData.map((item) => (
                        <li
                            key={item.label}
                            className={item.label === selectedTab.label ? styles.selected : ''}
                            onClick={() => setSelectedTab(item)}
                        >
                            {` ${item.label}`}
                            {item.label === selectedTab.label ? (
                                <motion.div className={styles.underline} layoutId='underline' />
                            ) : null}
                        </li>
                    ))}
                </ul>
            </nav>
            <section>
                <AnimateSharedLayout>
                    <motion.div
                        key={selectedTab ? selectedTab.label : '"empty"'}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {selectedTab ? selectedTab.content : ''}
                    </motion.div>
                </AnimateSharedLayout>
            </section>
        </div>
    );

    return (
        <section className={styles.container}>
            <div className={styles.content}>
                {baseTokenDisplay}
                {quoteTokenDisplay}
                <section className={styles.right_container}>
                    <div className={styles.right_container_top}>
                        <PoolInfoCard title='Market Cap:' data={'...'} />
                        <PoolInfoCard title='FDV:' data={'...'} />
                        <PoolInfoCard title='24h Swap Volume:' data={poolVolume || '...'} />
                        <PoolInfoCard title='Total Fees:' data={poolFees || '...'} />
                        <PoolInfoCard title='TVL:' data={poolTvl || '...'} />
                        <PoolInfoCard title='Tick Liquidity:' data={'...'} />
                        <PoolInfoCard title='OOR Liquidity:' data={'...'} />
                        <PoolInfoCard title='Pool Created:' data={'...'} />
                    </div>
                    {timeTabDisplay}
                </section>
            </div>
        </section>
    );
}
