const rateLimitMap = new Map(); // Store IP-based cooldown tracking

const RATE_LIMIT_TIME = 5 * 60 * 1000; // 5 minutes cooldown

const rateLimiter = (req, res, next) => {
  const userIP = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const cookieKey = req.cookies?.couponClaimed; // Check if cookie is set

  // 1️⃣ IP Tracking: Prevent multiple claims within cooldown period
  if (rateLimitMap.has(userIP)) {
    const lastClaimTime = rateLimitMap.get(userIP);
    const timeSinceLastClaim = Date.now() - lastClaimTime;

    if (timeSinceLastClaim < RATE_LIMIT_TIME) {
      return res.status(429).json({ message: "You have to wait before claiming another coupon!" });
    }
  }

  // 2️⃣ Cookie Tracking: Prevent multiple claims per session
  if (cookieKey) {
    return res.status(429).json({ message: "You have already claimed a coupon this session!" });
  }

  // Set cooldown timer and move to next middleware
  rateLimitMap.set(userIP, Date.now());
  next();
};

module.exports = rateLimiter;
