import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Basket, AddToBasketPayload } from "../types/basket.types";
import {
  fetchBasket,
  addToBasket,
  updateBasketItem,
  removeBasketItem,
  clearBasket,
} from "../services/api/basketService";

interface BasketState {
  basket: Basket | null;
  isOpen: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: BasketState = {
  basket: null,
  isOpen: false,
  loading: false,
  error: null,
};

export const fetchBasketThunk = createAsyncThunk(
  "basket/fetch",
  async (_, { rejectWithValue }) => {
    try { return await fetchBasket(); }
    catch (e: any) { return rejectWithValue(e.response?.data?.message ?? "Xəta"); }
  }
);

export const addToBasketThunk = createAsyncThunk(
  "basket/addItem",
  async (payload: AddToBasketPayload, { rejectWithValue }) => {
    try { return await addToBasket(payload); }
    catch (e: any) { return rejectWithValue(e.response?.data?.message ?? "Xəta"); }
  }
);

export const updateBasketItemThunk = createAsyncThunk(
  "basket/updateItem",
  async ({ itemId, quantity }: { itemId: number; quantity: number }, { rejectWithValue }) => {
    try { return await updateBasketItem({ itemId, quantity }); }
    catch (e: any) { return rejectWithValue(e.response?.data?.message ?? "Xəta"); }
  }
);

export const removeBasketItemThunk = createAsyncThunk(
  "basket/removeItem",
  async (itemId: number, { rejectWithValue }) => {
    try { return await removeBasketItem(itemId); }
    catch (e: any) { return rejectWithValue(e.response?.data?.message ?? "Xəta"); }
  }
);

export const clearBasketThunk = createAsyncThunk(
  "basket/clear",
  async (_, { rejectWithValue }) => {
    try { await clearBasket(); }
    catch (e: any) { return rejectWithValue(e.response?.data?.message ?? "Xəta"); }
  }
);

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    openBasket:  (state) => { state.isOpen = true;  },
    closeBasket: (state) => { state.isOpen = false; },
    toggleBasket:(state) => { state.isOpen = !state.isOpen; },
    resetBasket: () => initialState,
  },
  extraReducers: (builder) => {
    const setLoading  = (state: BasketState) => { state.loading = true; state.error = null; };
    const setBasket   = (state: BasketState, action: PayloadAction<Basket>) => { state.basket = action.payload; state.loading = false; };
    const setError    = (state: BasketState, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(fetchBasketThunk.pending,      setLoading)
      .addCase(fetchBasketThunk.fulfilled,    setBasket)
      .addCase(fetchBasketThunk.rejected,     setError)
      .addCase(addToBasketThunk.pending,      setLoading)
      .addCase(addToBasketThunk.fulfilled,    (state, action) => { setBasket(state, action); state.isOpen = true; })
      .addCase(addToBasketThunk.rejected,     setError)
      .addCase(updateBasketItemThunk.pending,  setLoading)
      .addCase(updateBasketItemThunk.fulfilled,setBasket)
      .addCase(updateBasketItemThunk.rejected, setError)
      .addCase(removeBasketItemThunk.pending,  setLoading)
      .addCase(removeBasketItemThunk.fulfilled,setBasket)
      .addCase(removeBasketItemThunk.rejected, setError)
      .addCase(clearBasketThunk.fulfilled, (state) => { state.basket = null; state.loading = false; });
  },
});

export const { openBasket, closeBasket, toggleBasket, resetBasket } = basketSlice.actions;
export default basketSlice.reducer;