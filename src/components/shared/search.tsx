import { Input } from "@/components/ui/input";

export default function Search({
  placeholder,
  value,
  className,
  onChange,
}: {
  placeholder: string;
  value: string;
  className: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="relative flex items-center w-full">
      <span className="absolute left-3 text-muted-foreground">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-search"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </span>
      <Input
        type="search"
        value={value}
        placeholder={placeholder}
        className={`${className} pl-9`}
        onChange={onChange}
      />
    </div>
  );
}
