import React from 'react';

export const BackgroundGradient = () => {
    return (
        <div className="fixed inset-0 -z-50 overflow-hidden">
            {/* Base Background Color:
        - Light mode: Uses your --background (white-ish)
        - Dark mode: We force a hard black for better contrast with the glow
      */}
            <div className="absolute inset-0 bg-background dark:bg-black transition-colors duration-300" />

            {/* Animated Orbs Container 
        We use opacity-30 for a subtle effect. Increase if you want it stronger.
      */}
            <div className="absolute inset-0 opacity-30 dark:opacity-20">

                {/* Orb 1: Primary Color (Purple) */}
                <div className="absolute top-0 -left-4 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-[128px] animate-blob dark:mix-blend-screen" />

                {/* Orb 2: Secondary Color (Cyan/Blue) - Delayed animation */}
                <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000 dark:mix-blend-screen" />

                {/* Orb 3: Accent Color (Orange) - More delayed */}
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-4000 dark:mix-blend-screen" />

                {/* Orb 4: Extra Primary Glow for center */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/40 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000 dark:mix-blend-screen" />
            </div>

            {/* Optional: Noise Texture Overlay for a "retro/cinematic" feel 
          Remove this div if you want a perfectly clean look. 
      */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        </div>
    );
};