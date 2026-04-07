// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import type { PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';
// import type { GenreMovieAdmin, GenresState } from '../../types/genre';
// import {APP_ENV} from "../../env";
//
// const API_URL =  `${APP_ENV.API_BASE_URL}/api/Genres`;
//
// const getErrorMessage = (error: unknown): string => {
//   if (axios.isAxiosError(error)) {
//     return error.response?.data?.message || error.message || 'Помилка мережі';
//   }
//   return 'Сталася невідома помилка';
// };
//
// // 1. Отримання списку жанрів
// export const fetchGenres = createAsyncThunk<GenreMovieAdmin[], void, { rejectValue: string }>(
//   'genres/fetchGenres',
//   async (_, { rejectWithValue }) => {
//     try {
//       // Типізуємо відповідь як об'єкт з полем items
//       const response = await axios.get<{ items: GenreMovieAdmin[] }>(API_URL);
//       return response.data.items; // Повертаємо саме масив items
//     } catch (error) {
//       return rejectWithValue(getErrorMessage(error));
//     }
//   }
// );
//
// // 2. Додавання нового жанру
// export const addGenre = createAsyncThunk<
//   GenreMovieAdmin,
//   { name: string; slug: string },
//   { rejectValue: string }
// >(
//   'genres/addGenre',
//   async (newGenre, { rejectWithValue }) => {
//     try {
//       const formData = new FormData();
//       formData.append('name', newGenre.name);
//       formData.append('slug', newGenre.slug);
//       // image можна буде додати пізніше тут: formData.append('image', file);
//
//       const response = await axios.post<GenreMovieAdmin>(API_URL, formData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(getErrorMessage(error));
//     }
//   }
// );
//
// // 3. Редагування жанру
// export const updateGenre = createAsyncThunk<
//   GenreMovieAdmin,
//   GenreMovieAdmin,
//   { rejectValue: string }
// >(
//   'genres/updateGenre',
//   async (genre, { rejectWithValue }) => {
//     try {
//       const formData = new FormData();
//       formData.append('id', genre.id.toString());
//       formData.append('name', genre.name);
//       formData.append('slug', genre.slug);
//       // Якщо в базі є image, і ми його не міняємо, краще теж переслати або обробити на бекенді
//       if (genre.image) formData.append('image', genre.image);
//
//       // Використовуємо PUT. Якщо бекенд видасть 405, спробуйте POST з методом-підміною
//       const response = await axios.put<GenreMovieAdmin>(API_URL, formData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(getErrorMessage(error));
//     }
//   }
// );
//
// // 4. Видалення жанру
// export const deleteGenre = createAsyncThunk<number, number, { rejectValue: string }>(
//   'genres/deleteGenre',
//   async (id, { rejectWithValue }) => {
//     try {
//       // Swagger вказує, що ID має бути в тілі запиту як JSON: { "id": 0 }
//       await axios.delete(API_URL, {
//         data: { id }, // Це надішле {"id": 18} у Body запиту
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });
//       return id;
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         return rejectWithValue(error.response?.data?.message || 'Помилка при видаленні');
//       }
//       return rejectWithValue('Сталася невідома помилка');
//     }
//   }
// );
//
// const initialState: GenresState = {
//   items: [],
//   status: 'idle',
//   error: null,
// };
//
// const genresSlice = createSlice({
//   name: 'genres',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Fetch
//       .addCase(fetchGenres.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(fetchGenres.fulfilled, (state, action: PayloadAction<GenreMovieAdmin[]>) => {
//         state.status = 'succeeded';
//         state.items = action.payload;
//       })
//       .addCase(fetchGenres.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload ?? 'Невідома помилка';
//       })
//
//       // Add
//       .addCase(addGenre.fulfilled, (state, action: PayloadAction<GenreMovieAdmin>) => {
//         state.items.push(action.payload);
//       })
//
//       // Update
//       .addCase(updateGenre.fulfilled, (state, action: PayloadAction<GenreMovieAdmin>) => {
//         const index = state.items.findIndex((g) => g.id === action.payload.id);
//         if (index !== -1) {
//           state.items[index] = action.payload;
//         }
//       })
//
//       // Delete
//       .addCase(deleteGenre.fulfilled, (state, action: PayloadAction<number>) => {
//         state.items = state.items.filter((g) => g.id !== action.payload);
//       });
//   },
// });
//
// export default genresSlice.reducer;
