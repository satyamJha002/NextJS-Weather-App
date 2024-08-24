"use client";
import { BiSearch } from "react-icons/bi";
import { cn } from "../utils/cn";

type InputProps = {
  className?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
};

const Input = ({ value, onSubmit, onChange, className }: InputProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "flex relative items-center justify-center h-10",
        className
      )}
    >
      <input
        type="text"
        placeholder="Search location"
        onChange={onChange}
        value={value}
        className="px-4 py-2 w-[230px] border border-gray-300 rounded-l-md focus:outline-none focus:border-blue-500 h-full"
      />
      <button className="px-4 py-[9px] bg-blue-500 text-white rounded-r-md focus:outline-none hover:border-blue-600 h-full">
        <BiSearch />
      </button>
    </form>
  );
};

export default Input;
