import React, { useEffect, useState } from 'react';
import { IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { FaArrowLeft } from "react-icons/fa";

const Search = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSearchPage, setIsSearchPage] = useState(false);
    const params = useLocation();
    const searchText = new URLSearchParams(params.search).get('q') || '';

    useEffect(() => {
        setIsSearchPage(location.pathname === "/search");
    }, [location]);

    const redirectToSearchPage = () => {
        navigate("/search");
    };

    const handleOnChange = (e) => {
        const value = e.target.value;
        const url = `/search?q=${value}`;
        navigate(url);
    };

    return (
        <div className="container mt-3">
            <div className="input-group rounded shadow-sm border border-secondary-subtle bg-light" style={{ maxWidth: 500 }}>
                <span className="input-group-text bg-white border-0">
                    {
                        isSearchPage ? (
                            <Link to={"/"} className="text-decoration-none text-dark">
                                <FaArrowLeft size={20} />
                            </Link>
                        ) : (
                            <IoSearch size={22} />
                        )
                    }
                </span>

                {
                    !isSearchPage ? (
                        <div
                            className="form-control border-0 bg-light text-muted"
                            style={{ cursor: "pointer" }}
                            onClick={redirectToSearchPage}
                        >
                            <TypeAnimation
                                sequence={[
                                    'Search "milk"',
                                    1000,
                                    'Search "bread"',
                                    1000,
                                    'Search "sugar"',
                                    1000,
                                    'Search "panner"',
                                    1000,
                                    'Search "chocolate"',
                                    1000,
                                    'Search "curd"',
                                    1000,
                                    'Search "rice"',
                                    1000,
                                    'Search "egg"',
                                    1000,
                                    'Search "chips"',
                                    1000,
                                ]}
                                wrapper="span"
                                speed={50}
                                repeat={Infinity}
                            />
                        </div>
                    ) : (
                        <input
                            type="text"
                            className="form-control border-0 bg-light"
                            placeholder='Search for atta dal and more.'
                            autoFocus
                            defaultValue={searchText}
                            onChange={handleOnChange}
                        />
                    )
                }
            </div>
        </div>
    );
};

export default Search;
