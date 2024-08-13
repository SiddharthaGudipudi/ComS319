import { useState, useEffect } from "react";
import "./App.css";

import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
  FormControl,
  Modal,
}from "react-bootstrap";

function App() {
  const [deleteProductId, setDeleteProductId] = useState("");
  const [product, setProduct] = useState([]);
  const [viewer1, setViewer1] = useState(false);
  const [viewer4, setViewer4] = useState(false);
  const [oneProduct, setOneProduct] = useState([]);
  const [checked4, setChecked4] = useState(false);
  const [index, setIndex] = useState(0);
  const [viewer2, setViewer2] = useState(false);
  const [editedProduct, setEditedProduct] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowAddModal = () => setShowAddModal(true);

  const handleCloseEditModal = () => setShowEditModal(false);
  const handleShowEditModal = () => setShowEditModal(true);

  const [showAboutModal, setShowAboutModal] = useState(false);
  const handleShowAboutModal = () => setShowAboutModal(true);
  const handleCloseAboutModal = () => setShowAboutModal(false);

  const [addNewProduct, setAddNewProduct] = useState({
    _id: 0,
    title: "",
    price: 0.0,
    description: "",
    category: "",
    image: "http://127.0.0.1:4000/images/",
    rating: { rate: 0.0, count: 0 },
  });


  function getAllProducts() {
    fetch("http://localhost:4000/")
      .then((response) => response.json())
      .then((data) => {
        console.log("Show Catalog of Products :");
        console.log(data);
        setProduct(data);
      });
    setViewer1(!viewer1);
  }

    useEffect(() => {
    getAllProducts();
  }, []);

  function handleChange(evt) {
    const value = evt.target.value;
    if (evt.target.name === "_id") {
      setAddNewProduct({ ...addNewProduct, _id: value });
    } else if (evt.target.name === "title") {
      setAddNewProduct({ ...addNewProduct, title: value });
    } else if (evt.target.name === "price") {
      setAddNewProduct({ ...addNewProduct, price: value });
    } else if (evt.target.name === "description") {
      setAddNewProduct({ ...addNewProduct, description: value });
    } else if (evt.target.name === "category") {
      setAddNewProduct({ ...addNewProduct, category: value });
    } else if (evt.target.name === "image") {
      const temp = value;
      setAddNewProduct({ ...addNewProduct, image: temp });
    } else if (evt.target.name === "rate") {
      setAddNewProduct({ ...addNewProduct, rating: { rate: value } });
    } else if (evt.target.name === "count") {
      const temp = addNewProduct.rating.rate;
      setAddNewProduct({
        ...addNewProduct,
        rating: { rate: temp, count: value },
      });
    }
  }

  function handleOnSubmit(e) {
    e.preventDefault();
    console.log(e.target.value);
    fetch("http://localhost:4000/insert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addNewProduct),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Post a new product completed");
        console.log(data);
        if (data) {
          const value = Object.values(data);
          alert(value);
        }
      });
  }

  useEffect(() => {
    getAllProducts();
  }, [checked4]);

  function deleteOneProduct(deleteProductId) {
    console.log("Product to delete :", deleteProductId);
    fetch("http://localhost:4000/delete/", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: deleteProductId }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Delete a product completed : ", deleteProductId);
        console.log(data);
        if (data) {
          const value = Object.values(data);
          alert(value);
        }
      });
    setChecked4(!checked4);
  }

  function handleUpdateProduct(e) {
    e.preventDefault();
    fetch("http://localhost:4000/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedProduct),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Update product completed");
        console.log(data);
        if (data) {
          const value = Object.values(data);
          alert(value);
        }
      });
  }

  function getAllProducts() {
    fetch("http://localhost:4000/")
      .then((response) => response.json())
      .then((data) => {
        console.log("Show Catalog of Products :");
        console.log(data);
        setProduct(data);
      });
    setViewer1(!viewer1);
  }

  const showAllItems = product.map((el) => (
    <Col key={el._id} md={4} className="product-col">
      <Card className="product-card">
        <Card.Img variant="top" src={el.image} className="card-img" />
        <Card.Body>
          <Card.Title>{el.title}</Card.Title>
          <Card.Text>{el.description}</Card.Text>
          <Card.Text>Category: {el.category}</Card.Text>
          <Card.Text>Price: ${el.price.toFixed(2)}</Card.Text>
          <Card.Text>Rate: {el.rating.rate}</Card.Text>
          <Card.Text>Count: {el.rating.count}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  ));
  

  function AboutUsModal(props) {
    return (
      <Modal show={props.show} onHide={props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>About Us</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Team Members:</h5>
          <ul>
            <li>Isaac Lo .</li>
            <li>Siddhartha Gudipudi</li>
          </ul>
          <p>Coms 319, Construction of User Interfaces. Proff : Aldaco. Date 12/10/2023</p>
          <p>MERN stack Assignment3. We are using MERN(Mongodb, Express.js, React.js, Node.js) as the full-stack for this assignment. We built an products catalog page which follows CRUD and easily usable. </p>
        </Modal.Body>
      </Modal>
    );
  }
  
  function AboutUsCard() {
    return (
      <Card>
        <Card.Header>About Us</Card.Header>
        <Card.Body>
          <Card.Title>Team Members:</Card.Title>
          <Card.Text>
            <ul>
              <li>Issac Lo</li>
              <li>Siddhartha Gudipudi</li>

            </ul>
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }

    function getOneProduct(id) {
    console.log(id);
    setOneProduct([]);
    setViewer2(false);
    if (id >= 1 && id <= 20) {
      fetch("http://localhost:4000/" + id)
        .then((response) => response.json())
        .then((data) => {
          console.log("About one product :", id);
          console.log(data);
          if (data) {
            const dataArr = [];
            dataArr.push(data);
            setOneProduct(dataArr);
            setViewer2(true);
          } else {
            console.log("Invalid ID");
            alert("Invalid ID entered");
          }
        })
        .catch((error) => {
          console.error("Error fetching product:", error);
          console.log("Invalid ID entered");
          alert("Invalid ID entered");
        });
    } else {
      console.log("Invalid ID entered");
      alert("Invalid ID entered");
    }
  }

  const showOneItem = oneProduct.map((el) => (
    <div key={el._id}>
      <img src={el.image} width={200} className="product-img" alt={el.title} />
      <h5>Title: {el.title}</h5>
      <p>Category: {el.category}</p>
      <p>Price: ${el.price.toFixed(2)}</p>
      <p>Rate: {el.rating.rate}</p>
      <p>Count: {el.rating.count}</p>
    </div>
  ));

  const handleNestedChange = (e, objectKey, propertyKey) => {
    const { name, value } = e.target;
    setAddNewProduct((prevProduct) => {
      return {
        ...prevProduct,
        [objectKey]: {
          ...prevProduct[objectKey],
          [propertyKey]: value,
        },
      };
    });
  };

  const [productId, setProductId] = useState(0);

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#" className="app-title">
            Catalog of Products
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link className="nav-link" onClick={() => getAllProducts()}>
                All Products
              </Nav.Link>
              <Nav.Link className="nav-link" onClick={handleShowAddModal}>
                Add Product
              </Nav.Link>
              <Nav.Link className="nav-link" onClick={handleShowEditModal}>
                Edit Product
              </Nav.Link>
              <Nav.Link className="nav-link" onClick={handleShowAboutModal}>
                About Us
              </Nav.Link>
              <Form className="d-flex">
                <FormControl
                  type="text"
                  placeholder="Enter Product ID"
                  className="mr-2"
                  value={deleteProductId}
                  onChange={(e) => setDeleteProductId(e.target.value)}
                />
                <Button variant="danger" onClick={() => deleteOneProduct(deleteProductId)}>
                  Delete
                </Button>
              </Form>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <AboutUsModal show={showAboutModal} onHide={handleCloseAboutModal} />

      <div className="product-list">
        <h3>Product List:</h3>
        <Container>
          <Row>{showAllItems}</Row>
        </Container>
      </div>

      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add a New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleOnSubmit} className="product-form">
            <input
              type="number"
              placeholder="id?"
              name="_id"
              value={addNewProduct._id}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="title?"
              name="title"
              value={addNewProduct.title}
              onChange={handleChange}
            />
            <input
              type="number"
              placeholder="price?"
              name="price"
              value={addNewProduct.price}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="description?"
              name="description"
              value={addNewProduct.description}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="category?"
              name="category"
              value={addNewProduct.category}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="image?"
              name="image"
              value={addNewProduct.image}
              onChange={handleChange}
            />
            <input
              type="number"
              placeholder="rate?"
              name="rate"
              value={addNewProduct.rating.rate}
              onChange={(e) => handleNestedChange(e, 'rating', 'rate')}
            />
            <input
              type="number"
              placeholder="count?"
              name="count"
              value={addNewProduct.rating.count}
              onChange={(e) => handleNestedChange(e, 'rating', 'count')}
            />
            <button type="submit" className="blue-button">Submit</button>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit an Existing Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form key={editedProduct._id} onSubmit={handleUpdateProduct} className="product-form">
            <input type="number" placeholder="id?" name="_id" value={editedProduct._id || ''} onChange={(e) => setEditedProduct({ ...editedProduct, _id: e.target.value })} />
            <input type="text" placeholder="title?" name="title" value={editedProduct.title || ''} onChange={(e) => setEditedProduct({ ...editedProduct, title: e.target.value })} />
            <input type="number" placeholder="price?" name="price" value={editedProduct.price || ''} onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })} />
            <input type="text" placeholder="description?" name="description" value={editedProduct.description || ''} onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })} />
            <input type="text" placeholder="category?" name="category" value={editedProduct.category || ''} onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })} />
            <input type="text" placeholder="image?" name="image" value={editedProduct.image || ''} onChange={(e) => setEditedProduct({ ...editedProduct, image: e.target.value })} />
            <input type="number" placeholder="rate?" name="rate" value={editedProduct.rating?.rate || ''} onChange={(e) => setEditedProduct({ ...editedProduct, rating: { ...editedProduct.rating, rate: e.target.value } })} />
            <input type="number" placeholder="count?" name="count" value={editedProduct.rating?.count || ''} onChange={(e) => setEditedProduct({ ...editedProduct, rating: { ...editedProduct.rating, count: e.target.value } })} />

            <button type="submit" className="blue-button">Update</button>
          </form>
        </Modal.Body>
      </Modal>

      <div className="one-product">
        <h3>One Product:</h3>
        <input
          type="number"
          placeholder="Enter product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        <button className="submit-button" onClick={() => getOneProduct(productId)}>
          Show Product
        </button>
        {showOneItem}
      </div>
    </div>
  );
}; 
export default App;