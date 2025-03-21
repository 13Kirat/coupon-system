import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin");
    }
  }, [navigate]);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/coupons/admin/all"
      );
      setCoupons(response.data);
    } catch (error) {
      console.error("Error fetching coupons", error);
    }
  };

  const addCoupon = async () => {
    try {
      await axios.post("http://localhost:5000/api/coupons/admin/add", {
        code: newCoupon,
      });
      setNewCoupon("");
      fetchCoupons();
    } catch (error) {
      console.error("Error adding coupon", error);
    }
  };

  const toggleCoupon = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/coupons/admin/toggle/${id}`
      );
      fetchCoupons();
    } catch (error) {
      console.error("Error updating coupon", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white text-gray-900 p-6">
      <h2 className="text-3xl font-semibold mb-6">Admin Dashboard</h2>

      {/* Add Coupon Section */}
      <div className="flex space-x-2 mb-6">
        <input
          type="text"
          value={newCoupon}
          onChange={(e) => setNewCoupon(e.target.value)}
          placeholder="Enter Coupon Code"
          className="p-2 border border-gray-300 rounded-lg focus:ring-blue-400"
        />
        <button
          onClick={addCoupon}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
        >
          Add Coupon
        </button>
      </div>

      {/* Coupons Table */}
      <div className="overflow-x-auto w-full max-w-2xl">
        <table className="w-full border border-gray-300 rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-2">Coupon Code</th>
              <th className="p-2">Status</th>
              <th className="p-2">Toggle</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id} className="border-t">
                <td className="p-2 text-center">{coupon.code}</td>
                <td
                  className={`p-2 text-center ${
                    coupon.isClaimed ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {coupon.isClaimed ? "Claimed" : "Available"}
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => toggleCoupon(coupon._id)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-lg transition"
                  >
                    Toggle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
