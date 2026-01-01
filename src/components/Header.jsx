import { NavLink } from "react-router-dom";
import { auth } from '../firebase/config.js';
import { signOut } from "firebase/auth";
import { setUser } from '../store/usersSlice.js';
import { useDispatch } from 'react-redux';

function Header({pageTitle}) {

  const dispatch = useDispatch();

  function handleLogOut() {
    if (confirm("Are you sure you want to log out?")){
      signOut(auth).then(() => {
        dispatch(setUser(null));
      }).catch((error) => {
        console.log(error);
      });
    }
  }

    return (
      <>

            <h1>{pageTitle}</h1>

            <div className="header-btns">

                    <NavLink to="/">
                      <button className="btn">
                          Books
                      </button>
                    </NavLink>

                    <NavLink to="/add-book">
                      <button className="btn">
                          Add Book +
                      </button>
                    </NavLink>

                    <button onClick={handleLogOut} className="btn transparent">
                      Logout
                    </button>

               
            </div>
    
      </>
    )
  }
  
  export default Header
  