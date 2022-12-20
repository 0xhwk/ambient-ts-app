import { useEffect, useMemo, useState, Dispatch, SetStateAction } from 'react';
import { TokenIF } from '../../../utils/interfaces/exports';
import TokenSelect from '../TokenSelect/TokenSelect';
import { useAppDispatch } from '../../../utils/hooks/reduxToolkit';
import { setToken } from '../../../utils/state/temp';
import { useSoloSearch } from './useSoloSearch';
import styles from './SoloTokenSelect.module.css';
import { memoizeFetchContractDetails } from '../../../App/functions/fetchContractDetails';
import { ethers } from 'ethers';
import SoloTokenImport from './SoloTokenImport';
// import { AiOutlineQuestionCircle } from 'react-icons/ai';

interface propsIF {
    provider: ethers.providers.Provider | undefined;
    importedTokens: TokenIF[];
    chainId: string;
    setImportedTokens: Dispatch<SetStateAction<TokenIF[]>>;
    // TODO: rewrite logic to build this Map from all lists not just active ones
    closeModal: () => void;
    verifyToken: (addr: string, chn: string) => boolean;
    getTokensByName: (searchName: string, chn: string, exact: boolean) => TokenIF[];
    getTokenByAddress: (addr: string, chn: string) => TokenIF | undefined;
    addRecentToken: (tkn: TokenIF) => void;
    getRecentTokens: (options?: { onCurrentChain?: boolean; count?: number | null }) => TokenIF[];
}

export const SoloTokenSelect = (props: propsIF) => {
    const {
        provider,
        importedTokens,
        chainId,
        setImportedTokens,
        closeModal,
        getTokensByName,
        getTokenByAddress,
        verifyToken,
        addRecentToken,
        getRecentTokens,
    } = props;

    // hook to process search input and return an array of relevant tokens
    // also returns state setter function and values for control flow
    const [outputTokens, validatedInput, setInput, searchType] = useSoloSearch(
        chainId,
        importedTokens,
        verifyToken,
        getTokenByAddress,
        getTokensByName,
    );

    // instance of hook used to retrieve data from RTK
    const dispatch = useAppDispatch();

    // fn to respond to a user clicking to select a token
    const chooseToken = (tkn: TokenIF): void => {
        // dispatch token data object to RTK
        dispatch(setToken(tkn));
        // determine if the token is a previously imported token
        const isTokenImported: boolean = importedTokens.some(
            (tk: TokenIF) => tk.address.toLowerCase() === tkn.address.toLowerCase(),
        );
        // if token is NOT imported, update local storage accordingly
        if (!isTokenImported) {
            // retrieve and parse user data object from local storage
            const userData = JSON.parse(localStorage.getItem('user') as string);
            // update value of `tokens` on user data object
            userData.tokens = [...importedTokens, tkn];
            // write updated value to local storage
            localStorage.setItem('user', JSON.stringify(userData));
            // update local state record of imported tokens
            // necessary as there is no event listener on local storage 😱
            setImportedTokens([...importedTokens, tkn]);
        }
        // array of recent tokens from App.tsx (current session only)
        const recentTokens = getRecentTokens();
        // determine if clicked token is already in the recent tokens array
        // if not in recent tokens array, add it
        recentTokens.some(
            (recentToken: TokenIF) =>
                recentToken.address.toLowerCase() === tkn.address.toLowerCase() &&
                recentToken.chainId === tkn.chainId,
        ) || addRecentToken(tkn);
        // close the token modal
        closeModal();
    };

    // hook to hold data for a token pulled from on-chain
    // null value is allowed to clear the hook when needed or on error
    const [customToken, setCustomToken] = useState<TokenIF | null>(null);
    useEffect(() => {
        // gatekeeping to pull token data from on-chain query
        // make sure a provider exists
        // validated input must appear to be a valid contract address
        // app must fail to find token in local data
        if (provider && searchType === 'address' && !verifyToken(validatedInput, chainId)) {
            // local instance of function to pull back token data from chain
            const cachedFetchContractDetails = memoizeFetchContractDetails();
            // promise holding query to get token metadata from on-chain
            const promise: Promise<TokenIF | undefined> = cachedFetchContractDetails(
                provider,
                validatedInput,
                chainId,
            );
            // resolve the promise
            Promise.resolve(promise)
                // if response has a `decimals` value treat it as valid
                .then((res: TokenIF | undefined) => res?.decimals && setCustomToken(res))
                // error handling
                .catch((err) => {
                    // log error to console
                    console.warn(err);
                    // set custom token as `null`
                    setCustomToken(null);
                });
        } else {
            // clear token data if conditions do not indicate necessity
            setCustomToken(null);
        }
        // run hook when validated input or type of search changes
        // searchType is redundant but may be relevant in the future
        // until then it does not hurt anything to put it there
    }, [searchType, validatedInput]);
    // EDS Test Token 2 address (please do not delete!)
    // '0x0B0322d75bad9cA72eC7708708B54e6b38C26adA'

    // value to determine what should be displayed in the DOM
    // this approach is necessary because not all data takes the same shape
    const contentRouter = useMemo<string>(() => {
        // declare an output variable for the hook
        let output: string;
        // router based on value of `validatedInput`
        // TODO: there must be a cleaner way of doing this, there is a specific
        // TODO: ... situation in which we need to show the user token data from
        // TODO: ... on-chain, in all other situations we just need token buttons
        switch (searchType) {
            case 'address':
                // pathway if input can be validated to a real extant token
                // can be in `allTokenLists` or in imported tokens list
                if (
                    verifyToken(validatedInput, chainId) ||
                    JSON.parse(localStorage.getItem('user') as string).tokens.some(
                        (tkn: TokenIF) =>
                            tkn.address.toLowerCase() === validatedInput.toLowerCase(),
                    )
                ) {
                    output = 'token buttons';
                    // pathway if the address cannot be validated to any token in local storage
                } else {
                    output = 'from chain';
                }
                break;
            case 'nameOrSymbol':
            case '':
            default:
                output = 'token buttons';
        }
        // return output string
        return output;
        // run hook when validated input or type of search changes
        // searchType is redundant but may be relevant in the future
        // until then it does not hurt anything to put it there
    }, [validatedInput, searchType]);

    // TODO: find the control flow to put this in the DOM
    // const tokenNotFound = (
    //     <div className={styles.token_not_found}>
    //         <p>Cound not find matching token</p>
    //         <AiOutlineQuestionCircle />
    //     </div>
    // );

    // hook to add focus to the input on after initial render, this is
    // preferable to autofocusing the element to ensure the DOM does not
    // ... have multiple autofocuses at once, background included
    useEffect(() => {
        document.getElementById('token_select_input_field')?.focus();
    }, []);

    // TODO: this is a function to clear the input field on click
    // TODO: we just need a button in the DOM to attach it
    // const clearInputField = () => {
    //     const input = document.getElementById('token_select_input_field') as HTMLInputElement;
    //     if (input) input.value = '';
    // }

    return (
        <section className={styles.container}>
            <div className={styles.input_control_container}>
                <input
                    id='token_select_input_field'
                    spellCheck='false'
                    type='text'
                    placeholder='&#61442; Search name or enter an Address'
                    onChange={(e) => setInput(e.target.value)}
                />
                <button>Clear</button>
            </div>
            {contentRouter === 'token buttons' &&
                outputTokens.map((token: TokenIF) => (
                    <TokenSelect
                        key={JSON.stringify(token)}
                        token={token}
                        tokensBank={importedTokens}
                        // TODO: refactor TokenSelect.tsx to remove this value and
                        // TODO: ... functionality, it is still here for now because we
                        // TODO: ... call this component from multiple places in the App
                        undeletableTokens={[]}
                        chainId={chainId}
                        setImportedTokens={setImportedTokens}
                        chooseToken={chooseToken}
                        isOnPortfolio={true}
                        fromListsText=''
                    />
                ))}
            {contentRouter === 'from chain' && (
                <SoloTokenImport customToken={customToken} chooseToken={chooseToken} />
            )}
        </section>
    );
};
