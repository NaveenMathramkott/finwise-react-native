import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  conversations: [],
  currentConversationId: null,
  loading: false,
  error: null,
  suggestions: [
    "How much did I spend on food this month?",
    "Show me my largest expenses",
    "Give me saving tips",
    "Compare this month with last month",
  ],
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push({
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      });
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearChat: (state) => {
      state.messages = [];
      state.error = null;
    },
    addConversation: (state, action) => {
      state.conversations.unshift(action.payload);
    },
    setCurrentConversation: (state, action) => {
      state.currentConversationId = action.payload;
    },
  },
});

export const {
  addMessage,
  setMessages,
  setLoading,
  setError,
  clearChat,
  addConversation,
  setCurrentConversation,
} = aiSlice.actions;

export default aiSlice.reducer;
