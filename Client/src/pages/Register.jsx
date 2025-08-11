import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Axios } from '../Utils/Axios';
import { SummaryApi } from '../common/SummaryApi';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Register() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    // console.log(e)
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = Object.values(data).every((val) => val);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.password !== data.confirmpassword) {
      toast.error("Password and confirm password must match");
      return;
    }

    try {
      const response = await Axios({
        url: SummaryApi.Register.url,
        method: SummaryApi.Register.method,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setData({
          name: "",
          email: "",
          password: "",
          confirmpassword: "",
        });
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        <div className="col-12 col-md-5 p-0">
          <img
            src="../assets/Sign up.svg"
            className="w-100 h-100"
            style={{ objectFit: "contain", minHeight: "100vh" }}
            alt="Register Visual"
          />
        </div>
        <div className="col-12 col-md-7 d-flex justify-content-center align-items-center">
          <form className="w-75 w-md-50" onSubmit={handleSubmit}>
            <h2 className="text-center mb-4">Register</h2>
            <div className="mb-3">
              <label htmlFor="nameInput" className="form-label">Name</label>
              <input
                name="name"
                type="text"
                className="form-control"
                id="nameInput"
                onChange={handleChange}
                value={data.name}
              />
            </div>


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
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: "absolute",
                  top: "38px",
                  right: "15px",
                  cursor: "pointer",
                  color: "#888"
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>


            <div className="mb-3 position-relative">
              <label htmlFor="confirmPasswordInput" className="form-label">Confirm Password</label>
              <input
                name="confirmpassword"
                type={showConfirmPassword ? "text" : "password"}
                className="form-control pe-5"
                id="confirmPasswordInput"
                onChange={handleChange}
                value={data.confirmpassword}
              />
              <span
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                style={{
                  position: "absolute",
                  top: "38px",
                  right: "15px",
                  cursor: "pointer",
                  color: "#888"
                }}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className="btn text-dark w-100 my-3 "
               style={{backgroundColor: "var(--color-primary)", borderColor: "var(--color-border)" }}
            >
              Submit
            </button>

            <div className="text-center">
              <span>Already have an account? <Link to="/login">Login</Link></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
