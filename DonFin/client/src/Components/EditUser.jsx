import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; 
import Sidebar from "./SideBar";
import TopBar from "./TopBar";
import "../Styles/EditUser.css";

const EditUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate(); 
  const [userData, setUserData] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`http://localhost:8000/api/users/${userId}`);
        setUserData({
          email: data.user.email,
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (err) {
        setError("Failed to fetch user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let errors = {};
    if (!userData.email) errors.email = "Email is required.";

    if (userData.oldPassword && userData.newPassword) {
      if (userData.newPassword !== userData.confirmPassword) {
        errors.password = "New password and confirm password do not match.";
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setFormErrors({}); 
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors); 
      return;
    }

    setLoading(true);
    try {
      const formData = { ...userData };

      if (userData.oldPassword && userData.newPassword) {
        const { data } = await axios.get(`http://localhost:8000/api/users/${userId}`);
        
        if (data.user.password !== userData.oldPassword) {
          setError("Old password is incorrect.");
          setLoading(false);
          return;
        }

        formData.oldPassword = userData.oldPassword;
        formData.newPassword = userData.newPassword;
      }

      const response = await axios.put(
        `http://localhost:8000/api/users/${userId}/edit`,
        formData
      );
      setMessage(response.data.message || "User updated successfully!");
      setTimeout(() => {
        localStorage.removeItem('user');
        navigate('/login');
      }, );
    } catch (err) {
      setError("Failed to update user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !message) return <p>Loading user data...</p>;

  return (
    <div className="dashboard-container">
      <TopBar />
      <div className="dashboard-content">
        <Sidebar />
        <div className="main-content">
          <div className="edit-user-container">
            <h2>Edit User</h2>
            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
              <label>
                Email: <br />
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  required
                />
                {formErrors.email && <p style={{ color: "red" }}>{formErrors.email}</p>}
              </label>

              <label>
                Old Password: <br />
                <input
                  type="password"
                  name="oldPassword"
                  value={userData.oldPassword}
                  onChange={handleChange}
                />
              </label>
              <label>
                New Password: <br />
                <input
                  type="password"
                  name="newPassword"
                  value={userData.newPassword}
                  onChange={handleChange}
                />
                {formErrors.password && <p style={{ color: "red" }}>{formErrors.password}</p>}
              </label>
              <label>
                Confirm New Password: <br />
                <input
                  type="password"
                  name="confirmPassword"
                  value={userData.confirmPassword}
                  onChange={handleChange}
                />
              </label>

              <button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
