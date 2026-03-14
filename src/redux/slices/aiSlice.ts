import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { functions } from "../../api/appwrite";

interface Message {
  id: string;
  question: string;
  answer?: string;
  sender: "user" | "ai";
  timestamp: string;
  error?: string;
}

interface AIState {
  messages: Message[];
  conversations: any[];
  currentConversationId: string | null;
  loading: boolean;
  error: string | null;
  suggestions: string[];
}

const initialState: AIState = {
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

export const sendMessage = createAsyncThunk(
  "ai/sendMessage",
  async (
    { question, userId }: { question: string; userId: string },
    { rejectWithValue },
  ) => {
    // try {
    //   const response = await mockAiResponse(question);
    //   return { question, answer: response };
    // } catch (error: any) {
    //   return rejectWithValue(error.message || "Failed to get AI response");
    // }
    // Having higher pricing for the ai model, disabled for now
    // Remove or comment out this block when AI function is ready
    return new Promise<{ question: string; answer: string }>((resolve) => {
      setTimeout(() => {
        resolve({
          question,
          answer:
            "That's a great question! Based on your current budget data, you've spent 45% of your 'Groceries' budget this month. You have AED 550.00 remaining for the next two weeks. Stay consistent to reach your savings goal! 📈",
        });
      }, 1500);
    });
  },
);

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    clearChat: (state) => {
      state.messages = [];
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    updateMessage: (
      state,
      action: PayloadAction<{ id: string; answer?: string; error?: string }>,
    ) => {
      const messageIndex = state.messages.findIndex(
        (m) => m.id === action.payload.id,
      );
      if (messageIndex !== -1) {
        if (action.payload.answer) {
          state.messages[messageIndex].answer = action.payload.answer;
        }
        if (action.payload.error) {
          state.messages[messageIndex].error = action.payload.error;
        }
        state.messages[messageIndex].sender = "ai";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        // Add a temporary user message
        state.messages.push({
          id: action.meta.requestId,
          question: action.meta.arg.question,
          sender: "user",
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        // Find the placeholder and add the answer
        const messageIndex = state.messages.findIndex(
          (m) => m.id === action.meta.requestId,
        );
        if (messageIndex !== -1) {
          state.messages[messageIndex].answer = action.payload.answer;
          state.messages[messageIndex].sender = "ai"; // Mark as AI response
        } else {
          // Fallback if for some reason the user message wasn't added or found
          state.messages.push({
            id: Date.now().toString(),
            question: action.payload.question,
            answer: action.payload.answer,
            sender: "ai",
            timestamp: new Date().toISOString(),
          });
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // If the request failed, update the user message to show an error or remove it
        const messageIndex = state.messages.findIndex(
          (m) => m.id === action.meta.requestId,
        );
        if (messageIndex !== -1) {
          state.messages[messageIndex].error = action.payload as string;
          state.messages[messageIndex].sender = "ai"; // Mark as AI response with error
        }
      });
  },
});

export const { addMessage, clearChat, setLoading, updateMessage } =
  aiSlice.actions;

export default aiSlice.reducer;
export type { AIState, Message };

