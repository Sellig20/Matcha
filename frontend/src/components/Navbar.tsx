import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/fm">FameRating</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;