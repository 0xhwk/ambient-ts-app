import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface graphData {
    positionsByUser: positionsByUser;
}

export interface positionsByUser {
    id: string;
    positions: Array<position>;
    denomInBase: boolean;
    primQty: string;
    isTokenABase: boolean;
    dexBalTokenA: boolean;
    dexBalTokenB: boolean;
}

export interface position {
    ambient: boolean;
    askTick: number;
    bidTick: number;
    id: string;
    pool: pool;
}

export interface pool {
    base: string;
    id: string;
    poolIdx: string;
    quote: string;
}

const initialState: graphData = {
    positionsByUser: {
        id: '',
        positions: [],
        denomInBase: true,
        primQty: '',
        isTokenABase: true,
        dexBalTokenA: false,
        dexBalTokenB: false,
    },
};

export const graphDataSlice = createSlice({
    name: 'graphData',
    initialState,
    reducers: {
        setPositionsByUser: (state, action: PayloadAction<positionsByUser>) => {
            state.positionsByUser = action.payload;
        },
    },
});

// action creators are generated for each case reducer function
export const { setPositionsByUser } = graphDataSlice.actions;

export default graphDataSlice.reducer;