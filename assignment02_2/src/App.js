import React, { useState, useEffect } from "react";

function App() {
    const [showComponent, setShowComponent] = useState("index");
    const [cart, setCart] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [formData, setFormData] = useState({});
    const [searchPhrase, setSearchPhrase] = useState("");
    const [products, setProducts] = useState([]);

    useEffect(() => {
        setProducts(require("./data.json"));
    }, []);

    const showCheckout = () => {
        if (showComponent === "confirmation") {
            setCart([]);
            setCartTotal(0);
        }
        setShowComponent("checkout");
    };

    const showIndex = () => {
        if (showComponent === "confirmation") {
            setCart([]);
            setCartTotal(0);
        }

        setShowComponent("index");
    };

    const showConfirmation = () => {
        setShowComponent("confirmation");
    };

    const addProduct = (product) => {
        const existingProduct = cart.find(
            (item) => item.productName === product.productName
        );

        if (existingProduct) {
            existingProduct.quantity += 1;
            setCart([...cart]);
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }

        setCartTotal(cartTotal + product.price);
    };

    const removeFromCart = (product) => {
        const existingProductIndex = cart.findIndex(
            (item) => item.productName === product.productName
        );
        if (existingProductIndex === -1) return;

        const existingProduct = cart[existingProductIndex];
        if (existingProduct.quantity === 1) {
            const updatedCart = cart.filter(
                (item) => item.productName !== product.productName
            );
            setCart(updatedCart);
        } else {
            const updatedProduct = {
                ...existingProduct,
                quantity: existingProduct.quantity - 1,
            };
            const updatedCart = [...cart];
            updatedCart.splice(existingProductIndex, 1, updatedProduct);
            setCart(updatedCart);
        }
    };

    const filteredProducts = products.filter((product) =>
        product.productName.toLowerCase().includes(searchPhrase.toLowerCase())
    );

    const listItems = filteredProducts.map((product, index) => {
        // find the product in the cart if it exists
        const productInCart = cart.find(
            (item) => item.productName === product.productName
        );
        // get the quantity or default to 0 if the product is not in the cart
        const quantity = productInCart ? productInCart.quantity : 0;

        return (
            <div key={index}>
                <div className="col">
                    <div className="card shadow-sm">
                        <img src={require("./images/" + product.src)} alt={product.productName} />

                        <div className="card-body">
                            <strong>{product.productName}</strong>
                            <p className="card-text">{product.text}</p>
                            <div className="d-flex justify-content-between align-items-end">
                                <div className="btn-group">
                                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => removeFromCart(product)}>
                                        -
                                    </button>

                                    <span className="btn btn-sm btn-outline-secondary">
                                        {quantity}
                                    </span>

                                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => addProduct(product)}>
                                        +
                                    </button>

                                </div>
                                <small className="text-body-emphasis">${product.price}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    });

    const Index = () => {
        return (
            <div>
                <div>
                    <div id="main">
                        <section className="py-5 text-center container">
                            <div className="row py-lg-5">
                                <div className="col-lg-6 col-md-8 mx-auto">
                                    <h1 className="fw-light">WILLOW STORE</h1>
                                    <p className="lead text-body-secondary">
                                        Welcome!! Hope you find your requiment.
                                        <br />
                                        Cricket, yes! Come In!
                                    </p>
                                </div>
                            </div>
                        </section>
                        <div className="album py-5 bg-light cardBackground">
                            <div className="container">
                                <div id="container" className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                                    {listItems}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

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
                setShowComponent("confirmation");
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
                                <div className="text">
                                    <button type="button" className="btn btn-primary" id="checkOut" onClick={showIndex}>
                                        Return
                                    </button>
                                </div>
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
                                            <li className="list-group-item d-flex justify-content-between lh-sm">
                                                <div>
                                                    <h6 className="my-0">{product.productName}</h6>
                                                    <small className="text-body-secondary">
                                                        {product.quantity}
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
                                                ${(0.07 * cartTotal).toFixed(2)}
                                            </span>
                                        </li>

                                        <li className="list-group-item d-flex justify-content-between">
                                            <span>Total (USD)</span>
                                            <strong>${(cartTotal + 0.07 * cartTotal).toFixed(2)}</strong>
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
                                            type="submit"
                                        >
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
    };

    const Confirmation = (props) => {
        return (
            <div className="d-flex flex-column mx-5 p-5 gap-5 justify-content-center">
                <div className="text">
                    <button type="button" className="btn btn-primary" id="checkOut" onClick={showIndex}>
                        Continue Shopping
                    </button>
                </div>
                <h4 className="mb-3">Thank you for your purchase! Hope you like it!</h4>

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
                            <li className="list-group-item d-flex justify-content-between lh-sm">
                                <div>
                                    <h6 className="my-0">{product.productName}</h6>
                                    <small className="text-body-secondary">
                                        {product.quantity}
                                    </small>
                                </div>
                                <span className="text-body-secondary">
                                    ${product.quantity * product.price}
                                </span>
                            </li>
                        ))}

                        <li className="list-group-item d-flex justify-content-between">
                            <h6 className="my-0">Tax (7%)</h6>
                            <span className="text-body-secondary">${(0.07 * cartTotal).toFixed(2)}</span>
                        </li>

                        <li className="list-group-item d-flex justify-content-between">
                            <span>Total (USD)</span>
                            <strong>${(cartTotal + 0.07 * cartTotal).toFixed(2)}</strong>
                        </li>
                    </ul>
                </div>

                <h6>
                    {props.formData.firstName} {props.formData.lastName}
                    <br />
                    {props.formData.email}
                    <br />
                    {props.formData.address}
                    <br />
                    {props.formData.country}, {props.formData.state} {props.formData.zip}
                    <br />
                    XXXX-XXXX-XXXX-{props.formData.cardNumber.slice(-4)}
                    <br />
                    Expiration Date: {props.formData.expirationDate ? 'XX/XX' : 'N/A'}
                    <br />
                    CVV: {props.formData.cvv ? 'XXX' : 'N/A'}
                </h6>
            </div>
        );
    };

    return (
        <div>
            <header className="p-3 text-bg-dark">
                <div className="container">
                    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                        <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                            <li>
                                <button className="nav-link px-2 fw-bold text-white" onClick={showIndex}>
                                    WilloW Store
                                </button>
                            </li>
                        </ul>

                        <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
                            <input
                                type="search"
                                className="form-control form-control-dark text-bg-light"
                                value={searchPhrase}
                                onChange={(e) => setSearchPhrase(e.target.value)}
                                placeholder="Search..."
                                aria-label="Search"
                            />
                        </form>

                        <div className="text-end">
                            <button type="button" className="btn btn-primary" id="checkOut" onClick={showCheckout}>
                                Check Out
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {showComponent === "index" && <Index />}
            {showComponent === "checkout" && (
                <Checkout onShowConfirmation={showConfirmation} products={cart} />
            )}
            {showComponent === "confirmation" && (
                <Confirmation products={cart} formData={formData} />
            )}
        </div>
    );
}

export default App;
