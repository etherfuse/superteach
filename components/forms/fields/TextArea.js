const TextArea = ({
  label,
  name,
  type,
  placeholder = "",
  errorMessage = "",
  register,
  ...rest
}) => {
  const className = { ...rest.className };

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <textarea
          rows={4}
          name={name}
          id={name}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder={placeholder}
          defaultValue={""}
          {...register}
        />
      </div>
      <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
    </div>
  );
};

export default TextArea;
