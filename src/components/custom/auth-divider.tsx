export default function AuthDivider({ className = "" }) {
  return (
    <div className={className}>
      <hr className="border-[#DEDCDC]" />
      <div className="flex justify-center">
        <span className="mb-4- -mt-3.5 w-max bg-white px-1 py-0 text-center text-[#C0B5B1]">
          or
        </span>
      </div>
    </div>
  );
}
