import { useParams, Link, useNavigate } from 'react-router-dom';
import Notes from '../components/Notes.jsx';
import {useDispatch} from 'react-redux';
import {eraseBook, toggleRead} from '../store/booksSlice.js';
import { useState, useEffect } from 'react';
import { getDoc, doc} from "firebase/firestore";
import { db } from '../firebase/config.js';


function SingleBookPage() {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleEraseBook(id) {
    if(confirm('Are you sure you want to erase this book and all notes associated with it?')){
      dispatch(eraseBook(id));
      navigate("/");
    }
  }

  function handleToggleRead(book_info) {
    dispatch(toggleRead({id: book_info.id, isRead: book_info.isRead}))
    setBook({...book_info, isRead: !book_info.isRead})
  }

  const fetchBook= async(book_id) => {
    try {
      const docRef = doc(db, "Books", book_id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBook({id: docSnap.id, ...docSnap.data()})
      } else {
        console.log("No such document!");
      }
      setFetchStatus("sucess");
    } catch (err) {console.log(err)}
  }

  const {id} = useParams();
  const [book, setBook] = useState("");
  const [fetchStatus, setFetchStatus] = useState("idle");

  useEffect(()=>{
    if (fetchStatus == 'idle'){
      fetchBook(id);
    }
  })
    
    return (
      <>
        <div className="container">
            <Link to="/">
              <button className="btn">
                  ← Back to Books
              </button>
            </Link>

            {book ?
            
            <div>
              <div className="single-book">
                <div className="book-cover">
                    <img src={book.cover} />
                </div>

                <div className="book-details">
                    <h3 className="book-title">{ book.title }</h3>
                    <h4 className="book-author">{ book.author }</h4>
                    <p>{book.synopsis}</p>
                    <div className="read-checkbox">
                        <input 
                          onClick={()=>{handleToggleRead(book)}}
                          type="checkbox" 
                          defaultChecked={book.isRead} />
                        <label>{ book.isRead ? "Already Read It" : "Haven't Read it yet" }</label>
                    </div>
                    <div onClick={()=>handleEraseBook(book.id)} className="erase-book">
                        Erase book
                    </div>
                </div>
              </div>

              <Notes bookId={id} />
            </div> 
            
            : fetchStatus == 'sucess' ?
            
            <div>
              <p>Book not found. Click the button above to go back to the list of books.</p>
            </div>

            : fetchStatus == 'error' ? 

            <div>
              <p>Error founding the book.</p>
            </div>

            : 
            
            <div>
              <p>Error founding the book.</p>
            </div>

            }
            

        </div>

        
      </>
    )
  }
  
  export default SingleBookPage
  