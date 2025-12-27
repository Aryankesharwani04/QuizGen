import React from 'react';

export const BackgroundGradient = () => {
    return (
        <div className="fixed inset-0 -z-50 overflow-hidden">
            {/* 1. DEFINE CUSTOM ANIMATIONS */}
            <style>{`
                @keyframes drift-1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30vw, -10vh) scale(1.4); }
                    66% { transform: translate(10vw, 20vh) scale(0.8); }
                }
                @keyframes drift-2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(-30vw, 15vh) scale(1.3); }
                    66% { transform: translate(-10vw, -20vh) scale(0.9); }
                }
                @keyframes drift-3 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(25vw, 25vh) scale(1.2); }
                }
                @keyframes drift-4 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(-25vw, 10vh) scale(1.5); }
                }
                
                .animate-drift-1 { animation: drift-1 20s infinite ease-in-out alternate; }
                .animate-drift-2 { animation: drift-2 25s infinite ease-in-out alternate; }
                .animate-drift-3 { animation: drift-3 22s infinite ease-in-out alternate; }
                .animate-drift-4 { animation: drift-4 28s infinite ease-in-out alternate; }
                .animate-pulse-slow { animation: pulse 12s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            `}</style>

            {/* Base Background: Very soft white in light mode, Deep neutral gray in dark mode */}
            <div className="absolute inset-0 bg-slate-50/50 dark:bg-zinc-950 transition-colors duration-500" />

            {/* Gradient Container */}
            <div className="absolute inset-0 overflow-hidden">

                {/* Blob 1: Soft Indigo/Blue (Top Left) 
                    - Light: Pastel Indigo
                    - Dark: Deep Indigo Glow
                */}
                <div className="absolute top-0 -left-20 w-[45vw] h-[45vw] rounded-full 
                    bg-indigo-300/30 dark:bg-indigo-900/10 
                    blur-[100px] animate-drift-1"
                />

                {/* Blob 2: Soft Rose/Pink (Top Right) 
                    - Light: Pastel Rose
                    - Dark: Deep Rose Glow
                */}
                <div className="absolute top-0 -right-20 w-[40vw] h-[40vw] rounded-full 
                    bg-rose-300/30 dark:bg-rose-900/8 
                    blur-[100px] animate-drift-2"
                />

                {/* Blob 3: Soft Teal/Cyan (Bottom Left) 
                    - Light: Pastel Teal
                    - Dark: Deep Teal Glow
                */}
                <div className="absolute -bottom-40 -left-20 w-[45vw] h-[45vw] rounded-full 
                    bg-teal-300/30 dark:bg-teal-900/10 
                    blur-[100px] animate-drift-3"
                />

                {/* Blob 4: Soft Violet (Bottom Right) 
                    - Light: Pastel Violet
                    - Dark: Deep Violet Glow
                */}
                <div className="absolute -bottom-40 -right-20 w-[40vw] h-[40vw] rounded-full 
                    bg-violet-300/30 dark:bg-violet-900/8 
                    blur-[100px] animate-drift-4"
                />

                {/* Blob 5: Center Glow (Very subtle) */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full 
                    bg-blue-200/20 dark:bg-blue-900/10 
                    blur-[120px] animate-pulse-slow"
                />
            </div>

            {/* Noise Texture: Reduced opacity significantly for a cleaner look */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
        </div>
    );
};