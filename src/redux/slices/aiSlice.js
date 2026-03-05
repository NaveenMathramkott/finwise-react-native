import { createSlice } from '@reduxjs/toolkit';

const aiSlice = createSlice({
  name: 'ai',
  initialState: { messages: [], processing: false },
  reducers: {
    addMessage: (state, action) => { state.messages.push(action.payload); },
  },
});
export const { addMessage } = aiSlice.actions;
export default aiSlice.reducer;
