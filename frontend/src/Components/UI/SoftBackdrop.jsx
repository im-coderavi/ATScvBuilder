const SoftBackdrop = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Main dark background */}
            <div className="absolute inset-0 bg-gray-950" />

            {/* Animated gradient blobs */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[150px] animate-rgb-pulse-1" />
            <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-violet-500/15 rounded-full blur-[150px] animate-rgb-pulse-2" />
            <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[150px] animate-rgb-pulse-3" />

            {/* Radial fade overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]" />
        </div>
    );
};

export default SoftBackdrop;
