import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";  // Import useNavigate
import Sidebar from "./SideBar";
import TopBar from "./TopBar";
import "../Styles/EditUser.css";

const EditUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();  // Initialize useNavigate hook
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({}); // Add form validation state

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true); // Set loading to true while fetching
      try {
        const { data } = await axios.get(`http://localhost:8000/api/users/${userId}`);
        setUserData({
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
        });
      } catch (err) {
        setError("Failed to fetch user data. Please try again.");
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let errors = {};
    if (!userData.firstName) errors.firstName = "First name is required.";
    if (!userData.lastName) errors.lastName = "Last name is required.";
    if (!userData.email) errors.email = "Email is required.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setFormErrors({}); // Reset form errors
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors); // Set validation errors if any
      return;
    }

    setLoading(true); // Set loading to true during submission
    try {
      const response = await axios.put(
        `http://localhost:8000/api/users/${userId}/edit`,
        userData
      );
      setMessage(response.data.message || "User updated successfully!");
      // Redirect to /dashboard after successful submission
      setTimeout(() => {
        localStorage.removeItem('user');
        navigate('/login');      },)
    } catch (err) {
      setError("Failed to update user. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
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
                First Name: <br />
                <input
                  type="text"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleChange}
                  required
                />
                {formErrors.firstName && <p style={{ color: "red" }}>{formErrors.firstName}</p>}
              </label>
              <label>
                Last Name: <br />
                <input
                  type="text"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleChange}
                  required
                />
                {formErrors.lastName && <p style={{ color: "red" }}>{formErrors.lastName}</p>}
              </label>
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
