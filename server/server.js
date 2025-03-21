require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors({ origin: [process.env.CLIENT_URL], credentials: true }));
app.use(cookieParser());

app.set("trust proxy", 1);

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("MongoDB Connection Error:", err));


const couponRoutes = require("./routes/couponRoutes");
app.use("/api/coupons", couponRoutes);

const jwt = require("jsonwebtoken");
const ADMIN_SECRET = "kajsdhflkjashdfdsafsdf";

app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (password === "admin123") {
        const token = jwt.sign({ role: "admin" }, ADMIN_SECRET, { expiresIn: "1h" });
        res.json({ success: true, token });
    } else {
        res.status(401).json({ message: "Invalid password" });
    }
});


// Define a test route
app.get("/", (req, res) => {
    res.send("Coupon System Backend is Running!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
