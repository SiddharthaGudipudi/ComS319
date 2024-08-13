import { useState, useEffect } from "react";
import './App.css';


function App() {
    const [page, setPage] = useState("Home");
    const [cart, setCart] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);

    const addToCart = (item) => {
        const existingItem = cart.find(
            (cartItem) => cartItem.title === item.title
        );

        if (existingItem) {
            existingItem.quantity += 1;
            setCart([...cart]);
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }

        setCartTotal(cartTotal + item.price);
    };
    const removeFromCart = (item) => {
        const itemIndex = cart.findIndex(
            (cartItem) => cartItem.title === item.title
        );
        // If item was not found.
        if (itemIndex === -1) return;

        item = cart[itemIndex];
        if (item.quantity === 1) {
            const updatedCart = cart.filter(
                (cartItem) => cartItem.title !== item.title
            );
            setCart(updatedCart);
        } else {
            const updatedItem = {
                ...item,
                quantity: item.quantity - 1,
            };
            const updatedCart = [...cart];
            updatedCart.splice(itemIndex, 1, updatedItem);
            setCart(updatedCart);
        }
    };

    let navStyle = "nav-item nav-link link-success-emphasis px-3";

    return (
        <>
            <div className="container pb-3">
                <header className="border-bottom lh-1 py-3">
                    <div className="row flex-nowrap justify-content-between align-items-center">
                        <div className="col-4 text-left">
                            <a className="blog-header-logo text-body-emphasis text-decoration-none" href="">Vesper Flora</a>
                        </div>
                        <div className="col-4 pt-1">
                        </div>
                        <nav className="col-4 d-flex justify-content-end align-items-center">
                            <a className={page === "Home" ? "fw-bold " + navStyle : "" + navStyle} href="#" onClick={() => setPage("Home")}>Home</a>
                            <a className={page === "Plants" ? "fst-italic " + navStyle : "" + navStyle} href="#" onClick={() => setPage("Plants")}>Plants</a>
                            <a className={page === "Produce" ? "fst-italic " + navStyle : "" + navStyle} href="#" onClick={() => setPage("Produce")}>Produce</a>
                            <a className={page === "Blogs" ? "fst-italic " + navStyle : "" + navStyle} href="#" onClick={() => setPage("Blogs")}>Blogs</a>
                            <a className={page === "About us" ? "fst-italic " + navStyle : "" + navStyle} href="#" onClick={() => setPage("About us")} style={{ whiteSpace: 'nowrap' }}>About us</a>
                            {cart.length > 0 ?
                                <button type="button" onClick={() => setPage("Cart")} className="btn btn-sm btn-secondary">
                                    <a className="nav-item nav-link link-success-emphasis px-3" href="#" style={{ whiteSpace: 'nowrap' }}>Cart ({cart.reduce((total, { quantity }) => total + quantity, 0)})</a>
                                </button>
                                : <a className="nav-item nav-link link-success-emphasis px-3" href="#" onClick={() => setPage("Cart")}>Cart</a>}
                        </nav>
                    </div>
                </header>

            </div>
            <main className="container">
                {
                    (page === "Home" && <Home cart={cart} setPage={setPage} />)
                    || (page === "Plants" && <Plants cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />)
                    || (page === "Produce" && <Produce cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />)
                    || (page === "Blogs" && <Blogs />)
                    || (page === "About us" && <About />)
                    || (page === "Cart" && <Cart cart={cart} cartTotal={cartTotal} setCartTotal={setCartTotal} setCart={setCart} addToCart={addToCart} removeFromCart={removeFromCart} />)
                }
            </main>
        </> // end app
    ); // end return
}

function ProductList({ products, cart, removeFromCart, addToCart }) {
    const listItems = products.map((product, index) => {
        // find the product in the cart if it exists
        const productInCart = cart.find(
            (item) => item.title === product.title
        );
        // get the quantity or default to 0 if the product is not in the cart
        const quantity = productInCart ? productInCart.quantity : 0;

        return (
            <div key={index}>
                <div className="col">
                    <div className="row g-0 border rounded overflow-hidden flex-md-col mb-4 shadow-sm h-md-400 position-relative">
                        <div className="mx-auto d-none d-md-block h-200 text-center">
                            <img src={products[index].image} alt={product.title} width="200" height="200" preserveAspectRatio="xMidYMid slice" />
                        </div>

                        <div className="col p-2 d-flex flex-column position-static">
                            <h4>{product.title}</h4>
                            <p className="mb-auto">{product.description}</p>
                            <div className="d-flex justify-content-between align-items-end">
                                <div className="btn-group">
                                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => removeFromCart(product)}>
                                        -
                                    </button>

                                    <span className="btn btn-sm btn-outline-secondary">
                                        {quantity}
                                    </span>

                                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => addToCart(product)}>
                                        +
                                    </button>

                                </div>
                                <p className="text-body-secondary my-auto">${product.price}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    });

    return <>{listItems}</>;
}

function Plants({ cart, addToCart, removeFromCart }) {
    useEffect(() => { getAllPlants(); }, []);
    const [products, setProducts] = useState([]);

    function getAllPlants() {
        fetch("http://127.0.0.1:4000/api/catalog/getPlants")
            .then((response) => response.json())
            .then((data) => {
                console.log("Show Catalog of Plants :");
                console.log(data);
                setProducts(data);
            })
            .catch(error => { console.log(error) });
    }

    return (
        <>
            <div className="mb-2 pt-2 pb-2 mb-md-3 pt-md-5 pb-md-4 border-bottom">
                <strong className="d-inline-block mb-2 text-success-emphasis">Design</strong>
                <h1>Plants</h1>
                <div className="text-body-secondary">Catalog | Dec 3</div>
            </div>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                <ProductList products={products} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />
            </div>
        </>
    );
}

function Produce({ cart, addToCart, removeFromCart }) {
    useEffect(() => { getAllProduce(); }, []);
    const [products, setProducts] = useState([]);

    function getAllProduce() {
        fetch("http://127.0.0.1:4000/api/catalog/getProduce")
            .then((response) => response.json())
            .then((data) => {
                console.log("Show Catalog of Plants :");
                console.log(data);
                setProducts(data);
            })
            .catch(error => { console.log(error) });
    }

    return (
        <>
            <div className="mb-2 pt-2 pb-2 mb-md-3 pt-md-5 pb-md-4 border-bottom">
                <strong className="d-inline-block mb-2 text-success-emphasis">Produce</strong>
                <h1>Fresh produce</h1>
                <div className="text-body-secondary">Catalog | Dec 3</div>
            </div>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                <ProductList products={products} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />
            </div>
        </>
    );
}

function Blogs() {
    const MAX_DISLIKE_NUM = -3;
    const [blogs, setBlogs] = useState([]);
    useEffect(() => { getAllBlogPosts(); }, []);
    const [writeBlog, setWriteBlog] = useState(false);

    useEffect(() => {
        // This effect runs whenever the 'blogs' state changes
        console.log("Blogs state updated:", blogs);
    }, [blogs]);

    function getAllBlogPosts() {
        fetch("http://127.0.0.1:4000/api/blogs/get")
            .then((response) => response.json())
            .then((data) => {
                console.log("Show Blogs :");
                console.log(data);
                setBlogs(data);
            })
            .catch(error => { console.log(error) });
    }

    const blogDelete = async (blog) => {
        console.log("Goodbye. Blog hit maximum dislikes and was voted off.")

        await fetch("http://localhost:4000/api/blogs/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "id": blog.id }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Delete a blog completed : ", blog.id);
                console.log(data);
            });
        getAllBlogPosts();
    }

    const like = (blog) => {
        fetch("http://127.0.0.1:4000/api/blogs/like/", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(blog),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("like completed :)");
                console.log(data);
            });
        blog.likes += 1
    }
    const dislike = (blog) => {
        fetch("http://127.0.0.1:4000/api/blogs/dislike/", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(blog),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("dislike completed >:)");
                console.log(data);
            });
        blog.likes -= 1
        // dislikes results in a DELETE of the blog post.
        if (blog.likes <= MAX_DISLIKE_NUM && window.confirm('Oh no! Disliked blog is below maximum dislikes. Remove it?')) {
            blogDelete(blog);
        }
    }
    function toggleLike(id) {
        let updatedList = blogs.map(blog => {
            if (blog.id === id) {
                if (blog.hasOwnProperty('liked')) {
                    if (!blog.liked) {
                        if (blog.disliked) {
                            // Need to double like to cover dislike to like
                            like(blog)
                        }
                        like(blog)
                    } else {
                        dislike(blog)
                    }
                    blog.liked = !blog.liked
                    blog.disliked = false
                    return blog;
                } else {
                    if (blog.disliked) {
                        // Need to double like to cover dislike to like
                        like(blog)
                    }
                    like(blog)
                    blog.liked = true
                    blog.disliked = false
                    return blog;
                }
            } else {
                return blog;
            }
        });

        setBlogs(updatedList)
    }
    function toggleDislike(id) {
        let updatedList = blogs.map(blog => {
            if (blog.id === id) {
                if (blog.hasOwnProperty('disliked')) {
                    if (!blog.disliked) {
                        if (blog.liked) {
                            // Need to double dislike to cover like to dislike
                            dislike(blog)
                        }
                        dislike(blog)
                    } else {
                        like(blog)
                    }
                    blog.liked = false
                    blog.disliked = !blog.disliked
                    return blog;
                } else {
                    if (blog.liked) {
                        // Need to double dislike to cover like to dislike
                        dislike(blog)
                    }
                    dislike(blog)
                    blog.liked = false
                    blog.disliked = true
                    return blog;
                }
            } else {
                return blog;
            }
        });

        setBlogs(updatedList)
    }

    const WriteBlogButton = () => {
        return (
            <>
                <span className="text-center">
                    <button type="button" onClick={() => setWriteBlog(true)} className="btn btn-sm btn-secondary">
                        <a className="nav-item nav-link link-success-emphasis px-3" style={{ whiteSpace: 'nowrap' }} href="#">Blog me</a>
                    </button>
                </span>
                <div className="my-5"></div>
            </>
        );
    }

    const BlogForm = () => {
        const [title, setTitle] = useState("");
        const [author, setAuthor] = useState("");
        const [text, setText] = useState("");
        async function handleOnSubmit(e) {
            if (!text || !author || !title) {
                alert("Blog not complete.")
                return;
            }
            const newBlogPost = {
                id: blogs.length + 1,
                title: title,
                author: author,
                description: "",
                category: "",
                text: text,
                likes: 0,
            }
            e.preventDefault();
            console.log(e.target.value);
            await fetch("http://127.0.0.1:4000/api/blogs/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newBlogPost),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("Post new blog completed");
                    console.log(data);
                });

            setWriteBlog(false);
            getAllBlogPosts();
        }
        return (
            <>
                <div className="col">
                    <div className="row g-0 border rounded flex-md-col mb-4 shadow-sm position-relative">
                        <div className="p-2 my-1 d-flex flex-column position-static">
                            <div className="row d-flex justify-content-between pb-2 my-2 mx-2 border-bottom">
                                <h4 className="col col-md-6">
                                    <input type="text" placeholder="Title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                                </h4>
                                <div className="col col-md-6 d-flex justify-content-end">
                                    <button type="submit" className="butto rounded mr-4 my-2" onClick={handleOnSubmit}>
                                        submit
                                    </button>
                                    <button type="submit" className="button rounded mx-4 my-2" onClick={() => setWriteBlog(false)}>
                                        cancel
                                    </button>
                                </div>
                            </div>
                            <p className="mx-5">
                                <input type="text" placeholder="Author" name="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
                            </p>
                            <p className="text-body-secondary mx-5 mb-3">
                                <textarea className="h-md-400 w-100" type="text" placeholder="Your blog post text here..." name="text" value={text} onChange={(e) => setText(e.target.value)} />
                            </p>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    function BlogPosts({ blogs }) {
        function BlogPost({ blogs, blog, index, toggleLike, toggleDislike }) {
            const [likes, setLikes] = useState(blog.likes);

            const handleLike = () => {
                toggleLike(blog.id);

                setLikes(blogs[index].likes);
            }
            const handleDislike = () => {
                toggleDislike(blog.id);

                setLikes(blogs[index].likes);
            }
            return (
                <div key={index}>
                    <div className="col">
                        <div className="row g-0 border rounded overflow-hidden flex-md-col mb-4 shadow-sm position-relative">
                            <div className="p-2 my-1 d-flex flex-column position-static">
                                <div className="row d-flex justify-content-between pb-2 my-2 mx-2 border-bottom">
                                    <h4 className="col col-md-6">{blog.title}</h4>
                                    <div className="col col-md-6 d-flex justify-content-end">
                                        <p className="text-body-secondary my-auto">{likes}</p>
                                        <div className="btn-group mb-1 mx-2">
                                            <button type="button" className={blog.disliked ? "btn btn-sm btn-secondary" : "btn btn-sm btn-outline-secondary"} onClick={handleDislike}>
                                                👎
                                            </button>
                                            <button type="button" className={blog.liked ? "btn btn-sm btn-secondary" : "btn btn-sm btn-outline-secondary"} onClick={handleLike}>
                                                👍
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <p className="mx-5">{blog.author}</p>
                                <p className="text-body-secondary mx-5 mb-3">{blog.text}</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return blogs.map((blog, index) => {
            return (
                <BlogPost key={index} blogs={blogs} blog={blog} index={index} toggleLike={toggleLike} toggleDislike={toggleDislike} />
            );
        });
    }

    // BLOG PAGE RETURN
    return (
        <>
            <div className="mb-2 pt-2 pb-2 mb-md-3 pt-md-5 pb-md-4 border-bottom">
                <strong className="d-inline-block mb-2 text-success-emphasis">Learn</strong>
                <h1>Prompt of the day: How do you care for orchids?</h1>
                <div className="text-body-secondary">Blogs | Dec 12</div>
            </div>
            <div className="row row-cols-1">
                <BlogPosts blogs={blogs} />
                {
                    (writeBlog && <BlogForm />)
                    || (!writeBlog && <WriteBlogButton />)
                }
            </div>
        </>
    );
}


function About() {
    return (
        <>
            <div className="mb-2 pt-2 pb-2 mb-md-3 pt-md-5 pb-md-4 border-bottom">
                <strong className="d-inline-block mb-2 text-success-emphasis">About us</strong>
                <h1>Two computer scientists</h1>
                <div className="text-body-secondary pb-3">3 Dec 2023</div>
                <div className="text-body-primary">SE/ComS319 Construction of User Interfaces, Fall 2023</div>
                <small className="text-body-tertiary">Dr. Abraham N. Aldaco Gastelum - aaldaco@iastate.edu</small>
            </div>
            <div className="row row-cols-2 g-3 text-center">
                <div className="col">
                    <div className="row g-0 border rounded overflow-hidden flex-md-col mb-4 shadow-sm h-md-400 position-relative">
                        <div className="pt-3 d-none d-md-block h-200">
                            <img src={"http://127.0.0.1:4000/images/profile-isaac.jpg"} alt={"Isaac Lo"} width="200" height="200" preserveAspectRatio="xMidYMid slice" />
                        </div>

                        <div className="col p-2 d-flex flex-column position-static">
                            <h4>Isaac Lo</h4>
                            <p>Junior</p>
                            <small className="mb-auto">isaaclo@iastate.edu</small>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="row g-0 border rounded overflow-hidden flex-md-col mb-4 shadow-sm h-md-400 position-relative">
                        <div className="pt-3 d-none d-md-block h-200">
                            <img src={"http://127.0.0.1:4000/images/profile-sidd.jpg"} alt={"Siddhartha Gudipudi"} width="200" height="200" preserveAspectRatio="xMidYMid slice" />
                        </div>

                        <div className="col p-2 d-flex flex-column position-static">
                            <h4>Siddhartha Gudipudi</h4>
                            <p>Sophomore</p>
                            <small className="mb-auto">siddu123@iastate.edu</small>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function Cart({ cart, cartTotal, setCart, setCartTotal, addToCart, removeFromCart }) {
    const [showComponent, setShowComponent] = useState("Checkout")
    const [thisCart, ] = useState([...cart]);
    const [thisCartTotal, ] = useState(cartTotal);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        country: '',
        state: '',
        zip: '',
        cardNumber: '',
        expirationDate: '',
        cvv: '',
    });
    const Checkout = (props) => {
        const [values, setValues] = useState({
            firstName: "",
            lastName: "",
            email: "",
            address: "",
            country: "",
            state: "",
            zip: "",
            cardNumber: "",
            expirationDate: "",
            cvv: "",
        });
        const [errors, setErrors] = useState({});

        const handleSubmit = (e) => {
            e.preventDefault();
            const newErrors = {};
            let isValid = true;

            if (!values.firstName) {
                newErrors.firstName = "Please enter your first name.";
                isValid = false;
            }

            if (!values.lastName) {
                newErrors.lastName = "Please enter your last name.";
                isValid = false;
            }

            if (!validateEmail(values.email)) {
                newErrors.email = "Please enter a valid email address.";
                isValid = false;
            }

            if (!values.address) {
                newErrors.address = "Please enter your address.";
                isValid = false;
            }

            if (!values.country) {
                newErrors.country = "Please choose your country.";
                isValid = false;
            }

            if (!values.state) {
                newErrors.state = "Please choose your state.";
                isValid = false;
            }

            if (!validateZip(values.zip)) {
                newErrors.zip = "Please enter a valid zip code.";
                isValid = false;
            }

            if (!validateCardNumber(values.cardNumber)) {
                newErrors.cardNumber = "Please enter a valid credit card number.";
                isValid = false;
            }

            if (!validateExpirationDate(values.expirationDate)) {
                newErrors.expirationDate = "Please enter a valid expiration date (MM/YY).";
                isValid = false;
            }

            if (!validateCVV(values.cvv)) {
                newErrors.cvv = "Please enter a valid 3-digit CVV number.";
                isValid = false;
            }

            setErrors(newErrors);
            if (isValid) {
                console.log("submitForm();");
                setFormData(values);
                setCart([]);
                setCartTotal(0);
                setShowComponent("Receipt");
            }
        };
        const validateCardNumber = (number) => {
            const re = /^[0-9]{16}$/;
            return re.test(number);
        };
        const validateEmail = (email) => {
            const re = /\S+@\S+\.\S+/;
            return re.test(email);
        };
        const validateZip = (number) => {
            const re = /^[0-9]{5}$/;
            return re.test(number);
        };
        const validateExpirationDate = (date) => {
            const re = /^(0[1-9]|1[0-2])\/\d{2}$/;
            return re.test(date);
        };
        const validateCVV = (cvv) => {
            const re = /^[0-9]{3}$/;
            return re.test(cvv);
        };
        const handleChange = (e) => {
            setValues({ ...values, [e.target.name]: e.target.value });
        };
        const handleCreditCardChange = (e) => {
            var newVal = ''
            for (var i = 0, nums = 0; i < e.target.value.length && nums < 16; i++) {
                if (isNumeric(e.target.value[i])) {
                    newVal += e.target.value[i]
                    nums++;
                }
            }
            e.target.value = newVal
            setValues({ ...values, [e.target.name]: e.target.value });
        };
        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n)
        }
        const cardDisplayHandler = () => {
            const rawText = [...values.cardNumber.split('-').join('')]
            const creditCard = []
            rawText.forEach((t, i) => {
                if (i % 4 === 0 && i !== 0) {
                    creditCard.push('-');
                }
                creditCard.push(t)
            })
            return creditCard.join('')
        }

        return (
            <div>
                <div>
                    <div className="container">
                        <main>
                            <div className="py-2 text-center"></div>

                            <div className="row g-5">
                                <div className="col-md-5 col-lg-4 order-md-last">
                                    <h4 className="d-flex justify-content-between align-items-center mb-3">
                                        <span className="text-primary">Your cart</span>
                                        <span className="badge bg-primary rounded-pill">
                                            {props.products.reduce((acc, cur) => {
                                                return acc + cur.quantity;
                                            }, 0)}
                                        </span>
                                    </h4>
                                    <ul className="list-group mb-3">
                                        {props.products.map((product, index) => (
                                            <li key={index} className="list-group-item d-flex justify-content-between lh-sm">
                                                <div className="d-inline">
                                                    <h6 className="my-0">{product.title}</h6>
                                                    <small className="text-body-secondary">
                                                        x{product.quantity}
                                                    </small>
                                                </div>
                                                <span className="text-body-secondary">
                                                    ${product.quantity * product.price}
                                                </span>
                                            </li>
                                        ))}

                                        <li className="list-group-item d-flex justify-content-between">
                                            <h6 className="my-0">Tax (7%)</h6>
                                            <span className="text-body-secondary">
                                                ${(0.07 * thisCartTotal).toFixed(2)}
                                            </span>
                                        </li>

                                        <li className="list-group-item d-flex justify-content-between">
                                            <span>Total (USD)</span>
                                            <strong>${(thisCartTotal + 0.07 * thisCartTotal).toFixed(2)}</strong>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-md-7 col-lg-8">
                                    <h4 className="mb-3">Payment Information</h4>
                                    <form
                                        className="needs-validation"
                                        noValidate
                                        onSubmit={handleSubmit}
                                    >
                                        <div className="row g-3">
                                            <div className="col-sm-6">
                                                <label htmlFor="firstName" className="form-label">
                                                    First name
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="firstName"
                                                    name="firstName"
                                                    onChange={handleChange}
                                                    placeholder=""
                                                    value={values.firstName}
                                                    required
                                                />
                                                {errors.firstName && (
                                                    <div className="alert alert-danger">
                                                        {errors.firstName}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-sm-6">
                                                <label htmlFor="lastName" className="form-label">
                                                    Last name
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="lastName"
                                                    name="lastName"
                                                    onChange={handleChange}
                                                    value={values.lastName}
                                                    required
                                                />
                                                {errors.lastName && (
                                                    <div className="alert alert-danger">
                                                        {errors.lastName}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-12">
                                                <label htmlFor="email" className="form-label">
                                                    Email
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="email"
                                                    name="email"
                                                    onChange={handleChange}
                                                    value={values.email}
                                                    placeholder="you@example.com"
                                                    required
                                                />
                                                {errors.email && (
                                                    <div className="alert alert-danger">
                                                        {errors.email}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-12">
                                                <label htmlFor="address" className="form-label">
                                                    Address
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="address"
                                                    name="address"
                                                    onChange={handleChange}
                                                    value={values.address}
                                                    placeholder="1234 Main St"
                                                    required
                                                />
                                                {errors.address && (
                                                    <div className="alert alert-danger">
                                                        {errors.address}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-md-5">
                                                <label htmlFor="country" className="form-label">
                                                    Country
                                                </label>
                                                <select
                                                    className="form-select"
                                                    id="country"
                                                    required
                                                    name="country"
                                                    value={values.country}
                                                    onChange={handleChange}
                                                >
                                                    <option defaultValue="">Choose...</option>
                                                    <option>United States</option>
                                                    <option>Mexico</option>
                                                    <option>Canada</option>
                                                    <option>Brazil</option>
                                                    <option>Puerto Rico</option>
                                                    <option>India</option>
                                                    <option>Australia</option>
                                                    <option>Philippines</option>
                                                    <option>Taiwan</option>
                                                </select>
                                                {errors.country && (
                                                    <div className="alert alert-danger">
                                                        {errors.country}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-md-4">
                                                <label htmlFor="state" className="form-label">
                                                    State
                                                </label>
                                                <select className="form-select" id="state" required name="state" value={values.state} onChange={handleChange}>
                                                    <option defaultValue="">Choose...</option>
                                                    <option>California</option>
                                                    <option>Iowa</option>
                                                    <option>Nebraska</option>
                                                    <option>Kansas</option>
                                                    <option>Illinois</option>
                                                    <option>Florida</option>
                                                </select>
                                                {errors.state && (
                                                    <div className="alert alert-danger">
                                                        {errors.state}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-md-3">
                                                <label htmlFor="zip" className="form-label">
                                                    Zip
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="zip"
                                                    name="zip"
                                                    value={values.zip}
                                                    onChange={handleChange}
                                                    placeholder=""
                                                    required
                                                />
                                                {errors.zip && (
                                                    <div className="alert alert-danger">{errors.zip}</div>
                                                )}
                                            </div>

                                            <div className="col-lg-12">
                                                <label htmlFor="cardNumber" className="form-label">
                                                    Credit card number
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="cardNumber"
                                                    name="cardNumber"
                                                    placeholder="XXXX-XXXX-XXXX-XXXX"
                                                    value={cardDisplayHandler()}
                                                    onChange={handleCreditCardChange}
                                                    required
                                                />
                                                {errors.cardNumber && (
                                                    <div className="alert alert-danger">
                                                        {errors.cardNumber}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-lg-12">
                                                <label htmlFor="expirationDate" className="form-label">
                                                    Expiration Date (MM/YY)
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.expirationDate ? 'is-invalid' : ''}`}
                                                    id="expirationDate"
                                                    name="expirationDate"
                                                    placeholder="MM/YY"
                                                    value={values.expirationDate}
                                                    onChange={handleChange}
                                                    required
                                                />
                                                {errors.expirationDate && (
                                                    <div className="alert alert-danger">
                                                        {errors.expirationDate}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-lg-12">
                                                <label htmlFor="cvv" className="form-label">
                                                    CVV (3-digit)
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                                                    id="cvv"
                                                    name="cvv"
                                                    placeholder="CVV (3-digit)"
                                                    value={values.cvv}
                                                    onChange={handleChange}
                                                    required
                                                />
                                                {errors.cvv && (
                                                    <div className="alert alert-danger">
                                                        {errors.cvv}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <hr className="my-4" />
                                        <button
                                            className="w-100 btn btn-primary btn-lg"
                                            type="submit">
                                            Place Order
                                        </button>
                                    </form>
                                </div>
                            </div>
                            <div className="py-2 text-center"></div>
                        </main>
                    </div>
                </div>
            </div>
        );
    }; // END CHECKOUT

    const Receipt = (props) => {
        return (
            <div className="d-flex flex-column mx-5 p-5 gap-5 justify-content-center">
                <h3 className="">Flora Receipt:</h3>
                <div className="list-group">
                    <h4 className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-primary">Your cart</span>
                        <span className="badge bg-primary rounded-pill">
                            {props.products.reduce((acc, cur) => {
                                return acc + cur.quantity;
                            }, 0)}
                        </span>
                    </h4>
                    <ul className="list-group mb-3">
                        {props.products.map((product, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between lh-sm">
                                <div>
                                    <h6 className="my-0">{product.title}</h6>
                                    <small className="text-body-secondary">
                                        x{product.quantity}
                                    </small>
                                </div>
                                <span className="text-body-secondary">
                                    ${product.quantity * product.price}
                                </span>
                            </li>
                        ))}

                        <li className="list-group-item d-flex justify-content-between">
                            <h6 className="my-0">Tax (7%)</h6>
                            <span className="text-body-secondary">${(0.07 * thisCartTotal).toFixed(2)}</span>
                        </li>

                        <li className="list-group-item d-flex justify-content-between">
                            <span>Total (USD)</span>
                            <strong>${(thisCartTotal + 0.07 * thisCartTotal).toFixed(2)}</strong>
                        </li>
                    </ul>
                </div>

                <h5 className="">Thank you for your purchase.</h5>

                <h6>
                    <p>{props.formData.firstName} {props.formData.lastName}</p>
                    <p>{props.formData.email}</p>
                    <p>{props.formData.address}</p>
                    <p>{props.formData.country}, {props.formData.state} {props.formData.zip}</p>
                </h6>
            </div>
        );
    }; // END RECEIPT

    return (
        <>
            {showComponent === "Checkout" && (
                <Checkout products={cart} />
            )}
            {showComponent === "Receipt" && (
                <Receipt products={thisCart} formData={formData} />
            )}
        </>
    );

}
function Home({ setPage }) {
    return (
        <>
            <div className="px-4 py-5 my-5 text-center">
                <h1 className="display-5 fw-bold text-body-emphasis">Plant pioneers</h1>
                <div className="col-lg-6 mx-auto">
                    <p className="lead mb-4">Quickly design and customize modern, elegant spaces with Flora plants, the world’s most popular flora-first plant equipper, featuring succulent variables and mixins, a beautiful blog system, extensive prebuilt plant arrangements, and powerful horticulture insights.</p>
                    <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                        <a className="nav-item nav-link link-success-emphasis px-3" href="#" onClick={() => setPage("Plants")}>
                            <button type="button" className="btn btn-secondary btn-lg px-4 gap-3">Flora design</button>
                        </a>
                        <a className="nav-item nav-link link-success-emphasis px-3" href="#" onClick={() => setPage("About us")}>
                            <button type="button" className="btn btn-outline-tertiary btn-lg px-4">About us</button>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
