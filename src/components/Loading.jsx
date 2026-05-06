function Loading({ fullScreen = false }) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "min-h-screen" : "py-20"
      }`}
    >
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-4 border-portal-500/30"></div>

        <div className="absolute inset-0 w-14 h-14 rounded-full border-4 border-portal-500 border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
}

export default Loading;
