import { useEffect, useState } from 'react';
import axios from 'axios';

const SignupForm: React.FC = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log("dans frontend signuuuup");
            const response = await axios.post('http://localhost:8000/apiServeur/signup', { firstname, lastname, email, password });
            setMessage(response.data);
        } catch (err) {
            setMessage("popopo error frontend signup");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>firstName:</label>
                <input type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
            </div>
            <div>
                <label>lastName:</label>
                <input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
            </div>
            <div>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit">Sign Up</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default SignupForm;