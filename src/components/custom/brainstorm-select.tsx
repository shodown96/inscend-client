import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  Boxes,
  BarChart2,
  Users,
  ShoppingBag,
} from "lucide-react";
import { useBrainstormStore } from "@/lib/stores/brainstorm";

const menuItems = [
  {
    title: "Action Board",
    icon: <LayoutGrid className="w-4 h-4" />,
    items: ["All Action Cards", "General Statistics", "Keyboard shortcuts"],
  },
  {
    title: "Inventory",
    icon: <Boxes className="w-4 h-4" />,
    items: [],
  },
  {
    title: "Sales",
    icon: <ShoppingBag className="w-4 h-4" />,
    items: [],
  },
  {
    title: "Analytics",
    icon: <BarChart2 className="w-4 h-4" />,
    items: [],
  },
  {
    title: "Customers",
    icon: <Users className="w-4 h-4" />,
    items: [],
  },
];

export default function BrainstormSelect() {
  const [open, setOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { selected, setSelected } = useBrainstormStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleParentClick = (index: number, hasChildren: boolean, title: string) => {
    if (hasChildren) {
      setExpandedIndex(expandedIndex === index ? null : index);
    } else {
      setSelected(title);
      setOpen(false);
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700"
      >
        <span className="font-semibold text-gray-800">
          {selected || "Select a category"}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-2xl border border-gray-200 p-3 z-50">
          <span className="text-gray-600 text-sm">Brainstorm on:</span>
          <ul className="space-y-1">
            {menuItems.map((menu, index) => {
              const hasChildren = menu.items.length > 0;
              const isExpanded = expandedIndex === index;

              return (
                <li key={menu.title}>
                  <button
                    onClick={() => handleParentClick(index, hasChildren, menu.title)}
                    className="flex items-center justify-between w-full px-2 py-2 rounded-lg hover:bg-gray-50"
                  >
                    <span className="flex items-center gap-2 text-gray-800 font-medium">
                      {menu.icon}
                      {menu.title}
                    </span>
                    {hasChildren && (
                      isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )
                    )}
                  </button>

                  {isExpanded && hasChildren && (
                    <ul className="ml-8 mt-1 space-y-1 text-gray-600">
                      {menu.items.map((item) => (
                        <li
                          key={item}
                          onClick={() => {
                            setSelected(item);
                            setOpen(false);
                          }}
                          className="px-2 py-1 rounded-md cursor-pointer hover:bg-gray-50"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
