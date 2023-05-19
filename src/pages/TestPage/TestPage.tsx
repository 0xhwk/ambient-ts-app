import styles from './TestPage.module.css';
import 'intro.js/introjs.css';
import { useUrlPath } from '../../utils/hooks/useUrlPath';

export default function TestPage() {
    const swapNav = useUrlPath('swap');

    const base = navOptions.baseURL;
    const full = navOptions.buildURL({
        chain: '0x5',
        tokenA: '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C',
        tokenB: '0x0000000000000000000000000000000000000000',
    });
    navOptions.navigate({
        chain: '0x5',
        tokenA: '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C',
        tokenB: '0x0000000000000000000000000000000000000000',
    });

    // const swapBase: string = navPaths.swap.baseURL;
    // const swapURL: string = navPaths.swap.buildFullURL(
        // {
        //     chain: '0x5',
        //     tokenA: '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C',
        //     tokenB: '0x0000000000000000000000000000000000000000',
        // }
    // );

    // const logPath = (): void => {
    //     const paramsForLink = {
    //         chain: '0x5',
    //         tokenA: '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C',
    //         tokenB: '0x0000000000000000000000000000000000000000',
    //     };
    //     const urlSlug: string = navPaths.swap.buildFullURL(paramsForLink)
    //     console.log({urlSlug});
    // }

    // const sendUser = (): void => {
    //     const paramsForLink = {
    //         chain: '0x5',
    //         tokenA: '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C',
    //         tokenB: '0x0000000000000000000000000000000000000000',
    //     };
    //     navPaths.swap.navigate(paramsForLink);
    // }

    return (
        <section className={styles.main}>
            <button onClick={logPath}>
                Get Path
            </button>
            <button onClick={sendUser}>
                Go To Swap
            </button>
        </section>
    );
}
