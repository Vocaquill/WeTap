import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define State Type for Images
interface ImageState {
    uploading: boolean;
    error: string | null;
}

// Initial State
const initialState: ImageState = {
    uploading: false,
    error: null,
};

// Upload Image Thunk with Improved Typing
export const uploadImage = createAsyncThunk<
    string, // URL of the uploaded image (success type)
    File, // Input type (file to upload)
    { rejectValue: string } // Rejected value type
>(
    'images/uploadImage',
    async (image, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', image);

            const response = await axios.post<string>('/api/images', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            return response.data; // The image URL
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.data) {
                return rejectWithValue(error.response.data as string);
            }
            return rejectWithValue('Failed to upload image');
        }
    }
);

// Image Slice
const imagesSlice = createSlice({
    name: 'images',
    initialState,
    reducers: {
        resetImageError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadImage.pending, (state) => {
                state.uploading = true;
                state.error = null;
            })
            .addCase(uploadImage.fulfilled, (state) => {
                state.uploading = false;
            })
            .addCase(uploadImage.rejected, (state, action) => {
                state.uploading = false;
                state.error = action.payload || 'Something went wrong';
            });
    },
});

export const { resetImageError } = imagesSlice.actions;
export default imagesSlice.reducer;