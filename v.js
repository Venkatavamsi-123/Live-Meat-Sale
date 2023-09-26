const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path'); //Inbuilt package
app.use(express.static(path.join(__dirname, 'assets')));
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
var admin = require("firebase-admin");

var serviceAccount = require("./le.json");
admin.initializeApp({
    credential: cert(serviceAccount)
});
// Initialize Firestore (you've already done this)




// Create a new Firestore collection for carts
//const cartCollection = collection(db, 'carts');






const db = getFirestore();

app.use(express.static('public'));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/signup', function (req, res) {
    res.sendFile(__dirname + "/public/" + "signup.html");
});

app.post("/signupSubmit", async function (req, res) {
    const user = {
        Fullname: req.body.Fullname,
        Email: req.body.Email,
        phoneno: req.body.Phoneno,
        Password: req.body.Password,
    }
    try {
        // Check if user already exists
        const userRef = db.collection('userdemo');

        const userDoc = await userRef.where('Email', '==', user.Email).get();
        if (!userDoc.empty) {
            const alertmessage = encodeURIComponent('User already exists. please Login');
            return res.redirect(`/signup?alertmessage=${alertmessage}`);
        }

        // Create user in Firestore
        await userRef.add(user);
        const alertmessage = encodeURIComponent('User created Successfully');
        return res.redirect(`/login?alertmessage=${alertmessage}`);
    } catch (error) {
        console.error('Error creating user:', error);
        const alertmessage = encodeURIComponent('An error occured');
        return res.redirect(`/signup?alertmessage=${alertmessage}`);
    }
});

app.get("/login", function (req, res) {
    res.sendFile(__dirname + "/public/" + "login.html");
});


app.post('/loginSubmit', async function (req, res) {
    try {
        const userRef = db.collection('userdemo');
        const querySnapshot = await userRef.where('Email', '==', req.body.Email).get();

        if (querySnapshot.empty) {
            const alertmessage = 'User not found. Please register.';
            return res.redirect(`/login?alertmessage=${encodeURIComponent(alertmessage)}`);
        }

        const userDoc = querySnapshot.docs[0]; // Get the first document from the query
        const storedEmail = userDoc.data().Email; // Assuming your Firestore field name is 'email'
        const enteredEmail = req.body.Email;

        if (storedEmail === enteredEmail) {
            // Now you can proceed with password validation logic
            const userPassword = userDoc.data().Password;
            const enteredPassword = req.body.Password;

            if (userPassword === enteredPassword) {
                const alertmessage = 'Login successful';
                return res.sendFile(__dirname + "/public/" + "mainpage.html");
            } else {
                const alertmessage = 'Incorrect password.';
                return res.redirect(`/login?alertmessage=${encodeURIComponent(alertmessage)}`);
            }
        } else {
            const alertmessage = 'Please check your email ID.';
            return res.redirect(`/login?alertmessage=${encodeURIComponent(alertmessage)}`);
        }
    } catch (error) {
        console.error('Error checking user:', error);
        const alertmessage = 'An error occurred';
        return res.redirect(`/login?alertmessage=${encodeURIComponent(alertmessage)}`);
    }
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/" + "v.html")
});
// parse request to body parser
const bodyparser = require('body-parser')
app.use(bodyparser.urlencoded({ extended: true }))

app.get('/livestream', (req, res) => {
    res.sendFile(__dirname + "/livestream.html")
})

app.get('/chicken', (req, res) => {
    res.sendFile(__dirname + "/chicken.html")
})

app.get('/seafood', (req, res) => {
    res.sendFile(__dirname + "/seafood.html")
})
app.get('/mutton', (req, res) => {
    res.sendFile(__dirname + "/mutton.html")
})
app.get('/home', (req, res) => {
    res.sendFile(__dirname + "/home.html")
})
app.get('/eggs', (req, res) => {
    res.sendFile(__dirname + "/eggs.html")
})
app.get('/v', function (req, res) {
    res.sendFile(__dirname + "/public/" + "v.html")
});
app.get('/index', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})




// Routes
app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/public/signup.html');
});

app.post('/signupSubmit', async (req, res) => {
    const user = {
        Fullname: req.body.Fullname,
        Email: req.body.Email,
        phoneno: req.body.Phoneno,
        Password: req.body.Password,
    };

    try {
        // Check if user already exists
        const userRef = db.collection('users');
        const userDoc = await userRef.where('Email', '==', user.Email).get();

        if (!userDoc.empty) {
            const alertmessage = encodeURIComponent('User already exists. Please log in.');
            return res.redirect(`/login?alertmessage=${alertmessage}`);
        }

        // Create user in Firestore
        await userRef.add(user);
        const alertmessage = encodeURIComponent('User created successfully. Please log in.');
        return res.redirect(`/login?alertmessage=${alertmessage}`);
    } catch (error) {
        console.error('Error creating user:', error);
        const alertmessage = encodeURIComponent('An error occurred.');
        return res.redirect(`/signup?alertmessage=${alertmessage}`);
    }
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.post('/loginSubmit', async (req, res) => {
    const email = req.body.Email;
    const password = req.body.Password;

    try {
        // Check if the user exists
        const userRef = db.collection('users');
        const userDoc = await userRef.where('Email', '==', email).get();

        if (userDoc.empty) {
            const alertmessage = encodeURIComponent('User not found. Please sign up.');
            return res.redirect(`/signup?alertmessage=${alertmessage}`);
        }

        // Check if the password matches (In a real application, use proper authentication)
        // For simplicity, we are assuming the password matches here
        const alertmessage = encodeURIComponent('Login successful.');
        return res.redirect(`/dashboard?alertmessage=${alertmessage}`);
    } catch (error) {
        console.error('Error logging in:', error);
        const alertmessage = encodeURIComponent('An error occurred.');
        return res.redirect(`/login?alertmessage=${alertmessage}`);
    }
});
// Add this route to your server code
app.post('/addToCart', async (req, res) => {
    try {
        const cartItem = req.body; // This should include product ID, name, price, and any other relevant information.

        // Add the cart item to Firestore
        const cartDocRef = await addDoc(collection(db, 'userdemo'), cartItem);

        // You can send a success response to the client
        res.status(200).json({ message: 'Item added to cart successfully', cartItemId: cartDocRef.id });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'An error occurred while adding the item to cart' });
    }
});
// Add this route to your server code
app.post('/addToCart', async (req, res) => {
    try {
        const cartItem = req.body; // This should include product ID, name, price, and any other relevant information.

        // Add the cart item to Firestore
        const cartDocRef = await addDoc(collection(db, 'userdemo'), cartItem);

        // You can send a success response to the client
        res.status(200).json({ message: 'Item added to cart successfully', cartItemId: cartDocRef.id });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'An error occurred while adding the item to cart' });
    }
});



dotenv.config({ path: 'config.env' })
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`The server is running on: http://localhost:${port}`);
});