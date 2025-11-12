import { useIsMobile } from "@/hooks/use-mobile";
import { cn, getLimitedText } from "@/lib/utils";
import { useMemo } from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const CustomSelect = ({
  placeholder = "Select",
  options = [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
    { label: "System", value: "system" },
  ],
  onChange,
  id = "",
  label = "",
  className = "",
  labelStyle = "",
  searchable = false,
  searchText = "",
  defaultValue,
  containerClass,
  leftIcon: LeftIcon,
  onSearchChange = () => { }
}: {
  id?: string;
  label?: string;
  labelStyle?: string;
  searchable?: boolean;
  className?: string
  placeholder?: string;
  searchText?: string,
  defaultValue?: string,
  containerClass?: string
  leftIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  onSearchChange?: (searchText: string) => void;
  options?: {
    value: any;
    label: string;
  }[];
  onChange?: (v: string) => void;
}) => {

  const defaultLabel = useMemo(() => {
    return options.find(v => v.value === defaultValue)?.label
  }, [defaultValue])

  const isMobile = useIsMobile()

  return (
    <div className={containerClass}>
      {label && (
        <p className={cn("text-[13px] font-medium w-full text-left mb-1", labelStyle)}>
          {label}
        </p>
      )}
      <Select onValueChange={onChange}>
        <SelectTrigger id={id} className={cn(
          "px-4 py-5 border border-input shadow-xs transition-all rounded-md",
          "focus-within:outline-none focus-within:ring-0 focus-within:ring-primary focus-within:border-primary",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          searchable ? "w-full" : "w-[180px]",
          className
        )}>
          <div className="flex gap-2 items-center">
            {LeftIcon ? <LeftIcon className="text-primary" /> : null}
            <SelectValue className="flex-1" placeholder={defaultLabel || placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent className="max-h-[250px]">
          {searchable ? (
            <Input
              placeholder="Search items"
              className="mb-2"
              value={searchText}
              onChange={e => onSearchChange(e.target.value)} />
          ) : null}
          {options.map((v) => (
            <SelectItem key={v.value} value={v.value}>
              {isMobile ? getLimitedText(v.label, 40) : v.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
