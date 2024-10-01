import React from 'react';
import '../assets/styles/HomePage.css'
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {

    return (
        <section className="gradient-custom" >


        <div className="title">Welcome in Matcha !</div>
        <div className="bubble-container">
            <div className="bubble left">
                <p>The application that'll help you to find the most suitable partner 💜 Based on several questions and criterions, join us to enjoy an incredible experience and meet extraordinaries people ! 💜</p>
            </div>
            <div className="bubble right">
                <p>Chat, Map, Fame-rating, the application offers a lot of features to find the perfect match. Let us take control of your love and sex journey, you won't regret it ! 🩵</p>
            </div>
            <div className="bubble left">
                <p>The most important is the consent and the respect of our collaborators. We trust you to experience that in the best way. Don't hesitate to reach us if you find any disturbance 💖</p>
            </div>
            <div className="bubble right">
                <p>What are you waiting for ? <Link to="/signup" style={{ color: 'inherit' }}>Subscribe</Link> and join the Matcha Team ! 💛</p>
            </div>
        </div>
            </section>
    )
}

export default HomePage;
