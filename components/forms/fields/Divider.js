const Divider = ({ label = "", hideLine = false, className }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className={`w-full ${!hideLine && "border-t border-gray-300"}`} />
      </div>
      <div className="relative flex justify-start">
        <span className="pr-3 bg-white text-lg font-medium text-gray-900">
          {label}
        </span>
      </div>
    </div>
  );
};

export default Divider;
