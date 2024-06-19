import React, { useEffect } from 'react';
import gsap from 'gsap';

const AnimatedBubbles: React.FC = () => {
    useEffect(() => {
        
        const tl = gsap.timeline({ repeat: -1 });

        tl.to('.bubble', {
            duration: 1,
            y: -100,
            ease: 'power1.inOut',
            stagger: {
                amount: 1,
                grid: 'auto',
                from: 'random'
            }
        });

        // Si vous avez besoin d'autres animations ou interactions, vous pouvez les ajouter ici

        return () => {
            tl.kill(); // Arrêter l'animation proprement lorsque le composant est démonté
        };
    }, []);

    return (
        <div className="bubbles-container">
            <h1>fffffffff</h1>
            <div className="bubble bubble-1"></div>
            <div className="bubble bubble-2"></div>
            <div className="bubble bubble-3"></div>
        </div>
    );
};

export default AnimatedBubbles;