const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const mongoose = require("mongoose");
const LogInCollection = require("./login");

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

const tempelatePath = path.join(__dirname, '../views');
const publicPath = path.join(__dirname, '../public');
console.log(publicPath);

app.set("view engine", "hbs");
app.set("views", tempelatePath);
app.use(express.static(publicPath));

mongoose.connect("mongodb://localhost:27017/petsbuyLogin")
    .then(() => {
        console.log('mongoose connected');
    })
    .catch(() => {
        console.log('failed to connect');
    });



app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/', (req, res) => {
    res.render('login')
})

app.get('/home', (req, res) => {
    res.render('home')
})

app.get('/pets', (req, res) => {
    res.render('pets')
})

app.get('/addtocart', (req, res) => {
    res.render('addtocart')
})




app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    await LogInCollection.insertMany([data]);

    res.render("login");
});



app.post('/login', async (req, res) => {

    try {
        const check = await LogInCollection.findOne({ email: req.body.email })

        if (check.password === req.body.password) {
            res.status(201).render("index", { email: req.body.email, password: req.body.password});
        }
        else {
            res.send("incorrect password")
        }
    }
    catch (e) {

        res.send("wrong details")

    }
})

//crenditial na fill karne wala code yaha se start

app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    if (!data.password) {
        // If the password field is missing or empty, send an alert message back to the client
        return res.render('signup', { errorMessage: 'Please provide a password.' });
    }

    try {
        await LogInCollection.insertMany([data]);
        res.render("login");
    } catch (error) {
        console.error(error);
        // Handle other errors if necessary
        res.render('signup', { errorMessage: 'An error occurred during signup. Please try again.' });
    }
});


///yaha pe khatam hai






app.post('/logout', (req, res) => {

    res.redirect('/login');
});


app.listen(4000, () => {
    console.log('port connected');
});
