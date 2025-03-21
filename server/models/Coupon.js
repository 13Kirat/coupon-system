const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    isClaimed: { type: Boolean, default: false },
    claimedBy: { type: String, default: null }, // IP address or session ID
});

module.exports = mongoose.model("Coupon", couponSchema);