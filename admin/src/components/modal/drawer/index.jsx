export default function Drawer({ isFullWidth = true, children }) {
  return (
    <div
      className={`${
        isFullWidth 
        ? "w-full fixed flex flex-col h-screen right-0 top-0 z-50" 
        : "w-full"
      } bg-white  bg-opacity-100 shadow-2xl opacity-100 `}
    >
      {children}
    </div>
  );
}
