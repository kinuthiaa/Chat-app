import React, { useEffect, useState } from 'react';
import Link from 'react-router'
import { useThemeStore } from '../store/useThemeStore';


const ComingSoon = () => {
    const { theme } = useThemeStore();
    const [count, setCount] = useState(0);
    const [loaded, setLoaded] = useState(false);

    // Animation states
    const [showTitle, setShowTitle] = useState(false);
    const [showSubtitle, setShowSubtitle] = useState(false);
    const [showCountdown, setShowCountdown] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        // Staggered animations
        setTimeout(() => setLoaded(true), 100);
        setTimeout(() => setShowTitle(true), 500);
        setTimeout(() => setShowSubtitle(true), 1000);
        setTimeout(() => setShowCountdown(true), 1500);
        setTimeout(() => setShowForm(true), 2000);

        // Count up animation
        const interval = setInterval(() => {
            setCount(prevCount => {
                if (prevCount < 100) return prevCount + 1;
                clearInterval(interval);
                return 100;
            });
        }, 30);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
            {/* Animated gradient background */}
            <div className={`absolute inset-0 ${theme === 'light' ? 'opacity-30' : 'opacity-70'}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent animate-gradient-xy"></div>
            </div>

            {/* Content container with glass effect */}
            <div className={`relative z-10 w-full max-w-3xl px-8 py-12 rounded-lg backdrop-blur-md 
                     ${theme === 'light' ? 'bg-base-100/80' : 'bg-base-300/30'} 
                     shadow-xl transition-all duration-700 transform
                     ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>

                {/* Logo */}
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary flex items-center justify-center shadow-lg
                       transition-all duration-700 transform hover:rotate-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>

                {/* Title */}
                <h1 className={`text-4xl md:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent 
                      bg-gradient-to-r from-primary to-secondary
                      transition-all duration-700 transform 
                      ${showTitle ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    Something Amazing is Coming
                </h1>

                {/* Subtitle */}
                <p className={`text-lg md:text-xl text-center mb-8 text-base-content/80
                     transition-all duration-700 transform
                     ${showSubtitle ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    We're working hard to bring you something incredible. Stay tuned for our launch!
                </p>

                {/* Progress bar */}
                <div className={`w-full h-4 bg-base-300 rounded-full mb-10 overflow-hidden
                       transition-all duration-700 transform
                       ${showCountdown ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${count}%` }}
                    ></div>
                    <p className="text-center mt-2 text-sm text-base-content/70">
                        {count}% Complete
                    </p>
                </div>

                {/* Email form */}
                <div className={`transition-all duration-700 transform
                       ${showForm ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="email"
                            placeholder="Enter your email for updates"
                            className="input input-bordered w-full md:flex-1 bg-base-100/50"
                        />
                        <button className="btn btn-primary px-8 hover:scale-105 transition-transform">
                            Notify Me
                        </button>
                    </div>
                    <div className="flex mx-auto">
                        <button className='flex items-center cursor-pointer justify-center btn btn-accent'>
                            <Link to={"/"}>Back Home</Link>
                        </button>
                    </div>
                    <p className="text-xs text-center mt-4 text-base-content/60">
                        We'll notify you when we launch. No spam, we promise!
                    </p>
                </div>
            </div>

            {/* Floating elements for decoration */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-float-delay"></div>
        </div>
    );
};

export default ComingSoon;