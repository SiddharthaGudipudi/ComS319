const express = require("express");
const db = require("./db.js");
const cors = require("cors");

const app = express();

const PORT = 4000;
app.use(cors());
app.use(express.json());

app.use(express.static("public"));
app.use("/images", express.static("images"));

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})

// Route to get all items in catalog
app.get("/api/catalog/get", (_, res) => {
    db.query("SELECT * FROM vesper_catalog", (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
})

// Route to get all plants
app.get("/api/catalog/getPlants", (_, res) => {
    db.query("SELECT * FROM vesper_catalog WHERE category = 'plants'", (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
})


// Route to get all produce
app.get("/api/catalog/getProduce", (_, res) => {
    db.query("SELECT * FROM vesper_catalog WHERE category = 'produce'", (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
})

// Route to get one record
app.get("/api/catalog/getFromId/:id", (req, res) => {
    const id = req.params.id;
    db.query(
        "SELECT * FROM vesper_catalog WHERE id = ?", id,
        (err, result) => {
            if (err) {
                console.log(err);
            }
            res.send(result);
        }
    );
});

// Route for creating a record
app.post("/api/catalog/create", (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const category = req.body.category;
    const image = req.body.image;
    const rating = req.body.rating;
    console.log(id, title, price, description, category, image, rating);
    db.query(
        "INSERT INTO vesper_catalog (id, title, price, description, category, image, rating) VALUES (?,?,?,?,?,?,?)",
        [id, title, price, description, category, image, rating],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            } else {
                res.status(200).send('Resource Created');
            }
            console.log(result);
        }
    );

});

// Route to delete a post
app.delete("/api/catalog/delete/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM vesper_catalog WHERE id= ?", id, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// Route for update a post
app.put("/api/catalog/update", (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const category = req.body.category;
    const image = req.body.image;
    const rating = req.body.rating;
    console.log(id, title, price, description, category, image, rating);
    db.query(
        "UPDATE vesper_catalog SET title=?, price=?, description=?, category=?, image=?, rating=? WHERE id=?",
        [title, price, description, category, image, rating, id],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            } else {
                console.log(result);
                res.status(200).send('Resource Updated');
            }
        }
    );
});

//
// Blogs Express endpoints
//

// Route to get all blogs
app.get("/api/blogs/get", (_, res) => {
    db.query("SELECT * FROM vesper_blogs", (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
})

// Route to get one blog record
app.get("/api/blogs/getFromId/:id", (req, res) => {
    const id = req.params.id;
    db.query(
        "SELECT * FROM vesper_blogs WHERE id = ?", id,
        (err, result) => {
            if (err) {
                console.log(err);
            }
            res.send(result);
        }
    );
});

// Route for creating a record
app.post("/api/blogs/create", (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const author = req.body.author;
    const text = req.body.text;
    const category = req.body.category;
    const image = req.body.image;
    const likes = req.body.likes;
    console.log(id, title, category, image, likes, text);
    db.query(
        "INSERT INTO vesper_blogs (id, title, author, image, likes, text) VALUES (?,?,?,?,?,?)",
        [id, title, author, image, likes, text],
        (err, result) => {
            if (err) {
                res.status(500).send(err);
                console.log(err);
            } else {
                res.status(200).send(result);
            }
            console.log(result);
        }
    );
});

// Route to delete a post
app.delete("/api/blogs/delete/", (req, res) => {
    const id = req.body.id;
    db.query("DELETE FROM vesper_blogs WHERE id= ?", id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

// Route for update a post
app.put("/api/blogs/update", (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const author = req.body.author;
    const text = req.body.text;
    const image = req.body.image;
    const likes = req.body.likes;
    console.log(id, title, author, image, likes, text);
    db.query(
        "UPDATE vesper_blogs SET title=?, author=?, image=?, likes=?, text=? WHERE id=?",
        [title, author, image, likes, text, id],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            } else {
                console.log(result);
                res.status(200).send('Resource Updated');
            }
        }
    );
});

// Route for update likes of a post
app.put("/api/blogs/like/", (req, res) => {
    const id = req.body.id;
    console.log("Blog ", id, ": add like.");
    db.query(
        "UPDATE vesper_blogs SET likes = likes + 1 WHERE id=?",
        [id],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                console.log(result);
                res.status(200).send(result);
            }
        }
    );
});

// Route for update dislikes of a post
app.put("/api/blogs/dislike/", (req, res) => {
    const id = req.body.id;
    console.log("Blog ", id, ": remove like.");
    db.query(
        "UPDATE vesper_blogs SET likes = likes - 1 WHERE id=?",
        [id],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                console.log(result);
                res.status(200).send(result);
            }
        }
    );
});
