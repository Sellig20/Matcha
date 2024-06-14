import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../assets/styles/userSignup.css'
import { useNavigate } from 'react-router-dom';

const UserSignup: React.FC = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/apiServeur/signup', { firstname, lastname, email, password });
            setMessage(response.data.message);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                console.log("*********************** signup correct and prepare to navigate *****************************")
                navigate('/apiServeur/home');
            }
        } catch (err) {
            setMessage("Erreur frontend signup");
        }
    };

    return (
        <section className="gradient-custom" >
        <div className="container py-5 h-100 ">
            <div className="row justify-content-center align-items-center h-100" >
            <div className="col-12 col-lg-9 col-xl-7">
                <div className="card shadow-2-strong card-registration" style={{ borderRadius: '150px'}}>
                <div className="card-body p-4 p-md-5 ">
                    <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 d-flex align-items-center justify-content-center">Sign up !</h3>
                    <form onSubmit={handleSubmit}>

                    <div className="row d-flex align-items-center justify-content-center">
                        <div className="col-md-6 mb-4 pb-2">
                        <div data-mdb-input-init className="form-outline">
                            <label className="form-label" htmlFor="firstName">First Name</label>
                            <input type="text" id="firstName" className="form-control form-control-lg" value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
                        </div>
                        </div>
                    </div>

                    <div className="row d-flex align-items-center justify-content-center">
                        <div className="col-md-6 mb-4 pb-2">
                        <div data-mdb-input-init className="form-outline">
                            <label className="form-label" htmlFor="lastName">Last Name</label>
                            <input type="text" id="lastName" className="form-control form-control-lg" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
                        </div>
                        </div>
                    </div>

                    <div className="row d-flex align-items-center justify-content-center">
                        <div className="col-md-6 mb-4 pb-2">
                        <div data-mdb-input-init className="form-outline">
                            <label className="form-label" htmlFor="emailAddress">Email</label>
                            <input type="email" id="emailAddress" className="form-control form-control-lg" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        </div>
                    </div>

                    <div className="row d-flex align-items-center justify-content-center">
                        <div className="col-md-6 mb-4 pb-2">
                        <div data-mdb-input-init className="form-outline">
                            <label className="form-label" htmlFor="passwordAddress">Password</label>
                            <input type="password" id="passwordAddress" className="form-control form-control-lg" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-2 d-flex align-items-center justify-content-center">
                        <input data-mdb-ripple-init className="btn btn-primary btn-lg" type="submit" value="Submit" />
                    </div>
                    {message && <p>{message}</p>}
                    </form>
                </div>
                </div>
            </div>
            </div>
        </div>
        </section>
    )
};

export default UserSignup;