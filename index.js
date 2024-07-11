const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use(session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// Authentication middleware
app.use("/customer/auth/*", (req, res, next) => {
    console.log("Authentication middleware invoked");
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];
        console.log("Token found in session: ", token);
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                console.log("User authenticated: ", user);
                next();
            } else {
                console.log("Token verification failed: ", err);
                return res.status(403).json({ message: "User not logged in" });
            }
        });
    } else {
        console.log("No token found in session");
        return res.status(403).json({ message: "User not logged in" });
    }
});

const PORT = 5001;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
