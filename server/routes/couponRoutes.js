const express = require("express");
const Coupon = require("../models/Coupon"); // Import the Coupon model
const rateLimiter = require("../middleware/rateLimiter");

const router = express.Router();

// Helper function to get user identifier (IP or Session)
const getUserIdentifier = (req) => {
    return req.cookies.userSession || req.ip;
};

// Claim a coupon
router.post("/claim", async (req, res) => {
    try {
        const user = getUserIdentifier(req);
        const existingClaim = await Coupon.findOne({ claimedBy: user });

        if (existingClaim) {
            return res.status(400).json({ message: "You have already claimed a coupon." });
        }

        const coupon = await Coupon.findOne({ isClaimed: false });

        if (!coupon) {
            return res.status(400).json({ message: "No coupons available." });
        }

        coupon.isClaimed = true;
        coupon.claimedBy = user;
        await coupon.save();

        res.json({ message: `You received coupon: ${coupon.code}` });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});


// 1️⃣ Admin - View All Coupons
router.get("/admin/all", async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.status(200).json(coupons);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// 2️⃣ Admin - Add a Coupon
router.post("/admin/add", async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) return res.status(400).json({ message: "Coupon code is required" });

        const newCoupon = new Coupon({ code });
        await newCoupon.save();

        res.status(201).json({ message: "Coupon added successfully", coupon: newCoupon });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// 3️⃣ Admin - Toggle Coupon Availability
router.put("/admin/toggle/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const coupon = await Coupon.findById(id);

        if (!coupon) return res.status(404).json({ message: "Coupon not found" });

        coupon.isClaimed = !coupon.isClaimed;
        await coupon.save();

        res.status(200).json({ message: "Coupon status updated", coupon });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
module.exports = router;
