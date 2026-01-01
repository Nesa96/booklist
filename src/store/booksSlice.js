import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import { db, auth } from '../firebase/config';

export const booksSlice = createSlice({
  name: 'books',
  initialState: {
    books: [],
    status: 'idle'
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchBooks.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        console.log(action.error.message);
        state.status = 'failed';
      })
      .addCase(toggleRead.fulfilled, (state, action) => {
        state.books.map(book => {
          if (book.id == action.payload) {
            book.isRead = !book.isRead;
          }
        });
      })
      .addCase(toggleRead.rejected, (state, action) => {
        console.log(action.error.message);
        state.status = 'failed';
      })
      .addCase(eraseBook.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(eraseBook.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.books = state.books.filter(book => book.id != action.payload);
      })
      .addCase(eraseBook.rejected, (state, action) => {
        console.log(action.error.message);
        state.status = 'failed';
      })
      .addCase(addBook.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.books.push(action.payload);
      })
      .addCase(addBook.rejected, (state, action) => {
        console.log(action.error.message);
        state.status = 'failed';
      })
  }
})

export const selectBooks = state => state.books;
export default booksSlice.reducer;

export const fetchBooks = createAsyncThunk("books/fetchBooks", async () => {
  const q = query(collection(db, "Books"), where("user_id", "==", auth.currentUser.uid));
  const querySnapshot = await getDocs(q);
  let bookList = [];
  querySnapshot.forEach((doc) => {
    bookList.push({id: doc.id, ...doc.data() }) 
  });
  return bookList
})

export const toggleRead = createAsyncThunk("books/toggleRead", async (payload) => {
  const bookRef = doc(db, "Books", payload.id);
  await updateDoc(bookRef, {
    isRead: !payload.isRead
  });
  return payload.id;
})

export const eraseBook = createAsyncThunk("books/eraseBook", async (payload) => {
  await deleteDoc(doc(db, "Books", payload));
  return payload;
})

export const addBook = createAsyncThunk("books/addBook", async (payload) => {
  let newBook = {...payload, user_id: auth.currentUser.uid}
  const docRef = await addDoc(collection(db, "Books"), newBook);
  newBook.id = docRef.id;
  return newBook;
})

