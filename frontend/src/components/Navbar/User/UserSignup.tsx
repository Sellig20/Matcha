import { useEffect, useState } from "react";
import "../../../assets/styles/Navbar/User/UserSignup.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../security/useAuth";
import { useForm } from "./useForm";
import axiosInstance from "../../../security/axiosInstance";

const UserSignup: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, checkAuthentification } = useAuth();
  const [formValues, handleChange] = useForm({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        "http://localhost:8000/apiServeur/signup",
        formValues
      );
      setMessage(response.data.message);
      if (response.data.token) {
        sessionStorage.setItem("token", response.data.token);
        checkAuthentification();
      }
    } catch (err) {
      setMessage("UserSignup.tsx | Error: Email already in use");
      setNotification("Error: Email already in use");
    }
  };

  const handleNavigateNotification = () => {
    navigate(`/apiServeur/userprofile`);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/apiServeur/usersettings");
    }
  }, [isAuthenticated, navigate]);

  return (
    <section className="gradient-custom">
      <div>{message && <p style={{ color: "red" }}>{message}</p>}</div>

      {notification && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>{notification}</p>
            <button
              className="btn-userproduct"
              onClick={handleNavigateNotification}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div>
        <h1>Sign up !</h1>
      </div>
      <div className="container py-5 h-100 ">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-12 col-lg-9 col-xl-7">
            <div
              className="card shadow-2-strong card-registration"
              style={{ borderRadius: "150px" }}
            >
              <div className="card-body p-4 p-md-5 ">
                <form onSubmit={handleSubmit}>
                  <div className="row d-flex align-items-center justify-content-center">
                    <div className="col-md-6 mb-4 pb-2">
                      <div
                        data-mdb-input-init
                        className="form-card form-outline-signup"
                      >
                        <div className="fields fields fields-signup">
                          <label className="form-label" htmlFor="firstName">
                            First Name
                          </label>
                        </div>
                        <div className="high highlight-text-signup">
                          <input
                            type="text"
                            id="firstname"
                            className="form-control form-control-lg"
                            value={formValues.firstname}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row d-flex align-items-center justify-content-center">
                    <div className="col-md-6 mb-4 pb-2">
                      <div
                        data-mdb-input-init
                        className="form-card form-outline-signup"
                      >
                        <div className="fields fields-signup">
                          <label className="form-label" htmlFor="lastName">
                            Last Name
                          </label>
                        </div>
                        <div className="high highlight-text-signup">
                          <input
                            type="text"
                            id="lastname"
                            className="form-control form-control-lg"
                            value={formValues.lastname}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row d-flex align-items-center justify-content-center">
                    <div className="col-md-6 mb-4 pb-2">
                      <div
                        data-mdb-input-init
                        className="form-card form-outline-signup"
                      >
                        <div className="fields fields-signup">
                          <label className="form-label" htmlFor="emailAddress">
                            Email
                          </label>
                        </div>
                        <div className="high highlight-text-signup">
                          <input
                            type="email"
                            id="email"
                            className="form-control form-control-lg"
                            value={formValues.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row d-flex align-items-center justify-content-center">
                    <div className="col-md-6 mb-4 pb-2">
                      <div
                        data-mdb-input-init
                        className="form-card form-outline-signup"
                      >
                        <div className="fields fields-signup">
                          <label
                            className="form-label"
                            htmlFor="passwordAddress"
                          >
                            Password
                          </label>
                        </div>
                        <div className="high highlight-text-signup">
                          <input
                            type="password"
                            id="password"
                            className="form-control form-control-lg"
                            value={formValues.password}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2 d-flex align-items-center justify-content-center">
                    <button data-mdb-ripple-init className="btn btn-lg">
                      {" "}
                      Submit{" "}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserSignup;
