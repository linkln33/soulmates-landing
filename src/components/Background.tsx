"use client";
export default function Background() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Animated radial orbs */}
      <div className="absolute -top-48 -left-48 w-[900px] h-[900px] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" />
      <div className="absolute top-1/2 -right-32 w-[600px] h-[600px] rounded-full bg-indigo-600/15 blur-[100px] animate-pulse [animation-delay:2s]" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-pink-600/10 blur-[100px] animate-pulse [animation-delay:4s]" />
      <div className="absolute top-1/3 left-1/2 w-[400px] h-[400px] rounded-full bg-violet-500/10 blur-[80px] animate-pulse [animation-delay:1s]" />
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(rgba(168,85,247,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}
