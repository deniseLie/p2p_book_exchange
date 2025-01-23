import React, { useEffect, useState } from 'react';
import { getUserProfile, getAllUserBook, addBookToUser } from '../../axios/profile_req';
import '../../css/Profile.css';
import PageLayout from '../Template/template';
import { useAuthContext } from '../../context/AuthContext';
import AddBook from './AddBook';
import { addABook } from '../../axios/book_req';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage () {
    
    const [profile, setProfile] = useState();
    const [listedBooks, setListedBooks] = useState();
    const [interestedBooks, setInterestedBooks] = useState();
    const [editing, setEditing] = useState(false);
    const [addingBook, setAddingBook] = useState(null);
    const [loading, setLoading] = useState(false);

    const { authToken, logout } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        getProfile();
        getListedBooks();
    }, []);

    const handleEditProfile = () => {
        // setEditing(!editing);
    };

    // get profile 
    const getProfile = async () => {
        try {
            const res = await getUserProfile(authToken);
            setProfile(res);
            console.log('getProfile', res);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    }

    // get listed books
    const getListedBooks = async () => {
        try {
            const res = await getAllUserBook(authToken);
            setListedBooks(res);
        } catch (error) {
            console.error('Error fetching listed books:', error);
        }
    }

    // Add Book Btn click
    const addBtnClick = (type) => {
        if (type == 'list' || type == 'interest') setAddingBook(type);
        
    }

    // Add book
    const addBook = async (bookData) => {
        if (loading) return;
        try {
            setLoading(true);
            console.log(bookData)
            let bookId = bookData?.bookId;
            let res = '';

            // New book - not existed
            if (!bookId) {
                res = await addABook(authToken, bookData);
                bookId = res?.newBook?._id;
            }

            const userRes = await addBookToUser(authToken, {...bookData, bookId: bookId});
            
            // Check if the book was successfully added
            if (userRes) {
                // Optionally, you could fetch the updated list from the server:
                // const updatedBooks = await fetchBooksFromServer();
                // setBooks(updatedBooks);  // Update the state with the new list

                // Or, just add the new book to the local state:
                if (addingBook == 'list') {
                    setListedBooks((prevBooks) => [
                        ...prevBooks,
                        { id: bookId, ...bookData }  // Add the new book to the existing list
                    ]);
                } else if (addingBook == 'interest') {
                    setInterestedBooks((prevBooks) => [
                        ...prevBooks,
                        { id: bookId, ...bookData }  // Add the new book to the existing list
                    ]);
                }
            }
        } catch (e) {
            console.error('Error add book', e?.message);
        } finally {
            setLoading(false);
            setAddingBook(null);
        }
    }

    // Function login out
    const loginOut = () => {
        logout();
        navigate('/');
    }

    return (
        <PageLayout>
            <div className="profile-page">
                {/* Profile Details */}
                <div className="profile-header">
                    {editing ? (
                        <div>
                            <input
                                type="text"
                                value={profile?.name}
                                onChange={(e) =>
                                    setProfile({ ...profile, name: e.target.value })
                                }
                            />
                            <input
                                type="text"
                                value={profile?.area}
                                onChange={(e) =>
                                    setProfile({ ...profile, area: e.target.value })
                                }
                            />
                            <button onClick={handleEditProfile}>Save</button>
                        </div>
                    ) : (
                        <div>
                            <img 
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSteItzPyeDKBxyWiOA8xrPZXIlxOYv1b1VVg&s/40" 
                                alt="book cover" 
                                className="book-cover-image" 
                            />
                            <h1>{profile?.username}</h1>
                            <p>{profile?.email}</p>
                            <button onClick={handleEditProfile}>✏️</button>
                            <a href="#" onClick={loginOut} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                                Logout
                            </a>
                        </div>
                    )}
                </div>

                {/* Listed Books Section */}
                <div className="book-section">
                    <div className="section-header">
                        <h2>Listed Books</h2>
                        <button className="add-button" onClick={() => addBtnClick('list')}>+ Add</button>
                        {listedBooks?.length > 0 && (
                            <button className="see-all-button">See All</button>
                        )}
                    </div>
                    {addingBook === 'list' && <AddBook onSubmit={addBook} list={true}/>}
                    <div className="book-list">
                        {listedBooks?.map((book) => (
                            <div key={book.id} className="book-item">
                                <img 
                                    src="https://templates.mediamodifier.com/5db698f47c3dc9731647a4e9/fiction-novel-book-cover-template.jpg" 
                                    alt="book cover" 
                                    className="book-cover-image" 
                                />
                                <h3>{book?.bookId?.title}</h3>
                                <p>{book?.bookId?.author}</p>
                                <p>{book?.bookCondition}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Interested Books Section */}
                <div className="book-section">
                    <div className="section-header">
                        <h2>Interested Books</h2>
                        <button className="add-button" onClick={() => addBtnClick('interest')}>+ Add</button>
                        {interestedBooks?.length > 0 && (
                            <button className="see-all-button">See All</button>
                        )}
                    </div>
                    {addingBook === 'interest' && <AddBook onSubmit={addBook} interest={true}/>}
                    <div className="book-list">
                        {interestedBooks?.map((book) => (
                            <div key={book.id} className="book-item">
                                <h3>{book.title}</h3>
                                <p>{book.category}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
