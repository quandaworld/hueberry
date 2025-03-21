const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const dotenv = require("dotenv");
dotenv.config();

const ensureAuthenticated = require("./middleware/auth");

const connectDB = require("./config/database");
const passportConfig = require("./config/passport");

const authRoutes = require("./routes/auth");
const assetRoutes = require("./routes/assets");
const projectRoutes = require("./routes/projects");
const dashboardRoutes = require("./routes/dashboard");

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Configure session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // TODO: currently 24 hours for dev, change for production
  })
);

// Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Initialize passport configuration
passportConfig(passport);

// Configure flash messages
app.use(flash());

// Set global variables for templates
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Use routes
app.use("/auth", authRoutes);
app.use("/assets", assetRoutes);
app.use("/projects", projectRoutes);
app.use("/dashboard", dashboardRoutes);

// Home route
app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
