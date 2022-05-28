import {
    AmbientLiqPos,
    RangeLiqPos,
    queryPos,
    getTokenDecimals,
    toDisplayPrice,
} from '@crocswap-libs/sdk';
import Moralis from 'moralis';
import { JsonRpcProvider } from '@ethersproject/providers';

export interface IParsedPosition {
    posHash: string;
    lpType: string;
    positionStatus: string;
    txHashes: string[];
    ambientLiq: string;
    accumQuoteFees: string;
    accumBaseFees: string;
    ambientSeeds: string;
    baseQty: string;
    quoteQty: string;
    concLiq: string;
    lowerPriceDisplay: number;
    upperPriceDisplay: number;
    lastUpdated: string;
    burnPending: boolean;
    posDetail: { pos: AmbientLiqPos | RangeLiqPos };
}

export async function parsePositionArray(
    data: Moralis.Object<Moralis.Attributes>[],
    provider: JsonRpcProvider,
    setParsedPositionArray: React.Dispatch<React.SetStateAction<IParsedPosition[]>>,
) {
    if (!provider) {
        return;
    }
    // console.log('Successfully retrieved ' + data?.length + ' UserPositions.');
    let positions: IParsedPosition[] = [];

    for (let i = 0; i < data?.length; i++) {
        const object = data[i];

        // if position has already been added to the positions array
        if (positions.some((e) => e.posHash === object.get('posHash'))) {
            /* positions contains the position we're looking for */

            // Find index of specific object using findIndex method.
            const objIndex = positions.findIndex((obj) => obj.posHash === object.get('posHash'));

            positions[objIndex].txHashes = [...positions[objIndex].txHashes, object.get('txHash')];

            if (
                positions[objIndex].lastUpdated &&
                Date.parse(positions[objIndex].lastUpdated) < object.get('createdAt').getTime()
            ) {
                positions[objIndex].lastUpdated = object.get('createdAt').toString();
            }
            if (object.get('burnPending') === true) {
                positions[objIndex].burnPending = true;
            }
            // else position has not yet been added to positions array
        } else {
            const pos = await queryPos(
                object.get('posHash'),
                object.get('txHash'),
                provider as JsonRpcProvider,
            );
            if (pos) {
                const lpType = pos.lpType;
                const ambientLiq = pos.ambientLiq?.toString();
                const accumQuoteFees = pos.accumQuoteFees?.toString();
                const accumBaseFees = pos.accumBaseFees?.toString();
                const ambientSeeds = (pos as AmbientLiqPos).ambientSeeds?.toString();
                const baseQty = pos.baseQty?.toString();
                const quoteQty = pos.quoteQty?.toString();
                const concLiq = (pos as RangeLiqPos).concLiq?.toString();
                let positionStatus;
                let lowerPriceDisplay = 0;
                let upperPriceDisplay = 0;
                if (lpType === 'range' && concLiq === '0') {
                    positionStatus = 'closed';
                } else if (lpType === 'ambient' && ambientLiq === '0') {
                    positionStatus = 'closed';
                } else {
                    positionStatus = 'open';
                    if (lpType === 'range') {
                        const lowerPriceNonDisplay = pos.lowerPrice;
                        const upperPriceNonDisplay = pos.upperPrice;
                        const baseDecimals = await getTokenDecimals(pos.baseToken, provider);
                        const quoteDecimals = await getTokenDecimals(pos.quoteToken, provider);
                        lowerPriceDisplay = toDisplayPrice(
                            lowerPriceNonDisplay,
                            baseDecimals,
                            quoteDecimals,
                        );
                        upperPriceDisplay = toDisplayPrice(
                            upperPriceNonDisplay,
                            baseDecimals,
                            quoteDecimals,
                        );
                        // console.log({ lowerPriceNonDisplay });
                        // console.log({ upperPriceNonDisplay });
                        // console.log({ lowerPriceDisplay });
                        // console.log({ upperPriceDisplay });
                    }
                }

                positions = [
                    ...positions,
                    {
                        posHash: object.get('posHash'),
                        lpType: lpType,
                        positionStatus: positionStatus,
                        burnPending: false,
                        txHashes: [object.get('txHash')],
                        ambientLiq: ambientLiq,
                        accumQuoteFees: accumQuoteFees,
                        accumBaseFees: accumBaseFees,
                        ambientSeeds: ambientSeeds,
                        baseQty: baseQty,
                        quoteQty: quoteQty,
                        concLiq: concLiq,
                        lowerPriceDisplay: lowerPriceDisplay,
                        upperPriceDisplay: upperPriceDisplay,
                        lastUpdated: object.get('createdAt').toString(),
                        posDetail: { pos },
                    },
                ];
            }
        }
    }
    // if (userPositionsRTK !== positions) {
    //   dispatch(setPositions(positions));
    // }
    setParsedPositionArray(positions);
}