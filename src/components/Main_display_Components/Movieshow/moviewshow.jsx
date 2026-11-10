import React, { useContext, useState, useEffect } from 'react'
import "./moviewshow.css"
function Moviewshow() {
    const [allmovies, Setallmovies] = useState([]);
    const [page, setpage] = useState(1);
    const [searchedmovie, setsearchedmovie] = useState([])
    var [searchvalue, Setsearchvalue] = useState("")
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [likedMovies, setLikedMovies] = useState([]);
    const [likedmovies_btn_active, setlikedmovies_btn_active] = useState(false)
    // 
    const API_KEY = "e3487f3b771f1d367dfadec4ebb9cdc8"
    // handle the liked and unliked movie button
    const handleclick = (movieId) => {
        setLikedMovies(prev => {

            if (prev.includes(movieId)) {

                return prev.filter(data => data !== movieId);

            }
            return [...prev, movieId];

        });
    }
    const viewlikedmovies = () => {
        setlikedmovies_btn_active(!likedmovies_btn_active)
    }
    // fetching the movie by likedmovie id 
    const fetchMovieById = async (movieId) => {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
        );

        const data = await response.json();

        return data;
    };
    const [likedMovieData, setLikedMovieData] = useState([]);
    useEffect(() => {
        async function getLikedMovies() {
            if (likedMovies.length === 0) {
                setLikedMovieData([]);
                return;
            }

            const moviePromises = likedMovies.map((id) => {
                return fetchMovieById(id);
            });

            const movies = await Promise.all(moviePromises);

            setLikedMovieData(movies);
        }

        getLikedMovies();
    }, [likedMovies]);
    // get the movies data by pages 
    useEffect(() => {
        const controller = new AbortController()
        const { signal } = controller;
        async function getMovies() {
            try {
                const res = await fetch(
                    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page},${signal}`
                );
                const data = await res.json();
                Setallmovies(data.results);
            }
            catch (err) {
                console.log(err);
            }
        }

        getMovies();
        return () => {
            controller.abort();
            console.log("Fething Aborted...")
        }
    }, [page]);
    // get the movies by search value
    useEffect(() => {
        async function getsearchedmovies() {
            try {
                const data = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchvalue}`)
                const res = await data.json();
                setsearchedmovie(res.results);
            } catch (error) {
                console.log(error)
            }
        }
        getsearchedmovies();
    }, [searchvalue]);


    return (
        <div>
            <div className="rightmenus">
                <input type="search" placeholder='Search Movies.....' value={searchvalue} onChange={(e) => Setsearchvalue(e.target.value)} />
                {searchvalue != "" ? <button className='clearsearch_btn' onClick={() => {
                    Setsearchvalue("");
                }}>Clear search</button> : ""}
            </div>
            <div className="moviedata_filter">


                {
                    searchvalue == "" ? <>
                        <button onClick={() => {
                            const sorted = [...allmovies].sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
                            Setallmovies(sorted)
                        }}>New to Old</button>
                        <button onClick={() => {
                            const sorted = [...allmovies].sort((a, b) => b.vote_average - a.vote_average)
                            Setallmovies(sorted)
                        }}>Rating - High to low</button>
                        <button className='viewliked_btn' title='liked movies' onClick={() => {
                            viewlikedmovies()
                        }}
                            
                        >
                           View Liked Movies
                        </button>
                    </> :
                        <>
                            <button onClick={() => {
                                const sorted = [...searchedmovie].sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
                                setsearchedmovie(sorted)
                            }}>New to Old</button>
                            <button onClick={() => {
                                const sorted = [...searchedmovie].sort((a, b) => b.vote_average - a.vote_average)
                                setsearchedmovie(sorted)
                            }}>Rating - High to low</button>



                        </>
                }
            </div>

            <div className="text"><h1 style={{ textAlign: "center", margin: "10px" }}>Total Movies:{searchvalue == "" ? allmovies.length : searchedmovie.length}</h1>
                <h1 style={{ textAlign: "center", margin: "10px" }}>Total Liked Movies:{likedMovies.length}</h1></div>
            <div className="moviecontainer">
                {likedmovies_btn_active ? <>
                    {/* when liked enabled */}
                    {likedMovies.length === 0 ? (<h1>No liked movies</h1>)  :
                        likedMovieData.map((movie, count) => (
                            <div key={movie.id} className="MovieBox">
                                <img src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt={movie.title} />
                                <div className="moviedata">
                                    <p >{count + 1}. Movie Name: {movie.title} </p>
                                </div>
                                <div className="actionbuttons">
                                    <button
                                        title='About Movie' onClick={() => setSelectedMovie(movie)}>
                                        <img
                                            width="24"
                                            height="24"
                                            src="https://www.svgrepo.com/show/529031/info-circle.svg"
                                            alt="About movie"
                                        />
                                    </button>
                                    <button
                                        title='Watch Stream Options'><img
                                            width="24"
                                            height="24"
                                            src="https://www.svgrepo.com/show/451311/show-multiple-layers-at-a-time.svg"
                                            alt="Watch Stream Options"
                                        />  </button>

                                    <button onClick={() => handleclick(movie.id)}>

                                        {likedMovies.includes(movie.id)
                                            ? "❤️"
                                            : "🤍"}

                                    </button>

                                </div>
                            </div>
                        ))}
                </> :
                    <>
                        {/* when liked disabled */}
                        {searchvalue != "" ? searchedmovie.length == 0 ? <>
                            <h2>No result found for {searchvalue}. pls try different </h2>
                        </> : "" : ""}
                        {searchvalue == "" ? allmovies.map((movie, count) => (
                            <div key={movie.id} className="MovieBox">
                                <img src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt={movie.title} />
                                <div className="moviedata">
                                    <p >{count + 1}. Movie Name: {movie.title} </p>
                                </div>
                                <div className="actionbuttons">
                                    <button
                                        title='About Movie' onClick={() => setSelectedMovie(movie)}>
                                        <img
                                            width="24"
                                            height="24"
                                            src="https://www.svgrepo.com/show/529031/info-circle.svg"
                                            alt="About movie"
                                        />
                                    </button>
                                    <button
                                        title='Watch Stream Options'><img
                                            width="24"
                                            height="24"
                                            src="https://www.svgrepo.com/show/451311/show-multiple-layers-at-a-time.svg"
                                            alt="Watch Stream Options"
                                        />  </button>

                                    <button onClick={() => handleclick(movie.id)}>

                                        {likedMovies.includes(movie.id)
                                            ? "❤️"
                                            : "🤍"}

                                    </button>

                                </div>
                            </div>
                        )) : searchedmovie.map((movie, count) => (
                            <div key={movie.id} className="MovieBox">

                                <img src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt={movie.title} />
                                <div className="moviedata">
                                    <p >{count + 1}. Movie Name: {movie.title} </p>
                                </div>
                                <div className="actionbuttons">
                                    <button
                                        title='About Movie' onClick={() => setSelectedMovie(movie)}>
                                        <img
                                            width="24"
                                            height="24"
                                            src="https://www.svgrepo.com/show/529031/info-circle.svg"
                                            alt="About movie"
                                        />
                                    </button>
                                    <button
                                        title='Watch Stream Options'><img
                                            width="24"
                                            height="24"
                                            src="https://www.svgrepo.com/show/451311/show-multiple-layers-at-a-time.svg"
                                            alt="Watch Stream Options"
                                        />  </button>

                                    <button onClick={() => handleclick(movie.id)}>

                                        {likedMovies.includes(movie.id)
                                            ? "❤️"
                                            : "🤍"

                                        }

                                    </button>

                                </div>

                            </div>

                        ))
                        }
                    </>}

            </div>

            {/*  showing the description */}
            {selectedMovie && (
                <div className="desc_overlay">

                    <div className="desc_container">

                        <button
                            className="close_desc"
                            onClick={() => setSelectedMovie(null)}
                        >
                            ✕
                        </button>

                        <img
                            src={`https://image.tmdb.org/t/p/original${selectedMovie.poster_path}`}
                            alt={selectedMovie.title}
                        />

                        <h2>{selectedMovie.title}</h2>

                        <p>
                            <strong>Release Date:</strong>
                            {selectedMovie.release_date}
                        </p>

                        <p>
                            <strong>Rating:</strong>
                            {selectedMovie.vote_average}
                        </p>

                        <p>
                            <strong>Description:</strong>
                            {selectedMovie.overview || "Description not available"}
                        </p>

                    </div>

                </div>
            )}

            <div className="pagepagination">
                <button
                    disabled={page === 1}
                    onClick={() => setpage(page - 1)}
                >
                    Previous
                </button>
                <div className="moviedata">Page: {page}</div>
                <button onClick={() => {
                    setpage(page + 1)
                }}>
                    Next Page
                </button>
            </div>
        </div >
    )
}

export default Moviewshow
