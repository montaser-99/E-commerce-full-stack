import React, { useState } from 'react';
import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Axios } from '../Utils/Axios';
import { SummaryApi } from '../common/SummaryApi';

function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "admin@gmail.com",
    password: "Admin1234*",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isFormValid = Object.values(data).every(val => val);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        url: SummaryApi.login.url,
        method: SummaryApi.login.method,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setData({ email: "", password: "" });
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        <div className="col-12 col-md-6 p-0">
          <img
            src="/assets/login.svg"
            className="h-100 w-100"
            style={{ objectFit: "contain" }}
            alt="Login Visual"
          />
        </div>

        <div className="col-12 col-md-6 d-flex justify-content-center align-items-center">
          <form className="w-75 w-md-50" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="emailInput" className="form-label">Email</label>
              <input
                name="email"
                type="email"
                className="form-control"
                id="emailInput"
                onChange={handleChange}
                value={data.email}
              />
            </div>

            <div className="mb-3 position-relative">
              <label htmlFor="passwordInput" className="form-label">Password</label>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                className="form-control pe-5"
                id="passwordInput"
                onChange={handleChange}
                value={data.password}
              />
              <span
                onClick={() => setShowPassword(prev => !prev)}
                style={{
                  position: 'absolute',
                  top: '38px',
                  right: '15px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                {showPassword ? <FaEye /> : <IoMdEyeOff />}
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 my-3"
              disabled={!isFormValid}
               style={{backgroundColor: "var(--color-primary)", borderColor: "var(--color-border)" }}
            >
              Sign-in
            </button>

            <Link to="/forgot-password" className="d-block mb-2">
              Forgot your password?
            </Link>
            <span>
              Don't have an account? <Link to="/register">Register</Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;

