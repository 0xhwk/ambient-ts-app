import { TokenIF } from '../interfaces/TokenIF';

export const filterTokensByChain = (tkns: Array<TokenIF>, chain: number) => {
    const tokensOnChain = tkns.filter((tkn: TokenIF) => tkn.chainId === chain);
    return tokensOnChain;
};

export const getCurrentTokens = (chainId: string) => {
    const tokensInLocalStorage = localStorage.getItem('testTokens');
    const allTokens = tokensInLocalStorage ? JSON.parse(tokensInLocalStorage) : '';
    // const tokensOnChain = filterTokensByChain(allTokens, parseInt(chainId));
    return allTokens;
};
