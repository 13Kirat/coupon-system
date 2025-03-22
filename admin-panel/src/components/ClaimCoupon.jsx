import { useState } from "react";
import axios from "axios";
import Message from "./Message";

const ClaimCoupon = () => {
  const [message, setMessage] = useState("");

  const claimCoupon = async () => {
    try {
      const response = await axios.post(
        "https://coupon-system-91ni.onrender.com/api/coupons/claim",
        {},
        { withCredentials: true }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900">
      <div className="bg-gray-100 shadow-lg rounded-2xl p-8 w-96 text-center">
        <h2 className="text-2xl font-semibold mb-4">Claim Your Coupon</h2>
        <button
          onClick={claimCoupon}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition"
        >
          Claim
        </button>
        {message && <Message text={message} />}
      </div>
    </div>
  );
};

export default ClaimCoupon;
