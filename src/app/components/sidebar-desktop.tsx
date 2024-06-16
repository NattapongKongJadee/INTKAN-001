"use client";
import React, {
  ReactNode,
  createContext,
  useContext,
  useState,
  CSSProperties,
} from "react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
// import as Logo from

interface SideBarDesktopProps {
  children?: ReactNode; // This allows any valid React node as children
}
const initialSidebarState = {
  expanded: false,
  // toggleSidebar: () => {},  // Placeholder function
};
const SideBarContext = createContext(initialSidebarState);
export function SideBarDesktop({ children }: SideBarDesktopProps) {
  const [expanded, setExpanded] = useState(false);
  const asideStyle: CSSProperties = {
    color: "#44377F",
    width: expanded ? "20%" : "5%",
    transition: "width 0.2s ease-in-out",
    height: "100vh",
    background: "#FFFFFF",
    boxShadow: "2px 0 12px rgba(0,0,0,0.1)",
    zIndex: "0",
  };
  return (
    <aside style={asideStyle}>
      <nav className="h-full flex flex-col  border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src="/logoipsum.svg"
            className={`overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
            alt=""
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-sky-400 hover:bg-red-400"
          >
            {expanded ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        </div>
        <SideBarContext.Provider value={{ expanded }}>
          <ul className="border-t flex flex-col p-3 flex-grow">{children}</ul>
        </SideBarContext.Provider>
        <div className=" border-t flex px-6 py-4 justify-start justify-items-end">
          <img
            src="https://ui-avatars.com/api/?rounded=true"
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`flex justify-between  items-center overflow-hidden transition-all ${
              expanded ? "w-32 ml-3" : "w-0 "
            }`}
          >
            <div className="flex flex-col justify-items-end leading-5">
              <h4 className="font-semibold">Thiantun Intakan</h4>
              <span className="text-xs text-black ">Administator</span>
            </div>
            <BsThreeDotsVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  );
}

export function SideBartItem({ icon, text, active, alert }: any) {
  const { expanded } = useContext(SideBarContext);

  return (
    <li
      className={`relative flex items-center py-2 ${
        expanded ? "px-2" : "px-5"
      } my-1 font-medium rounded-md cursor-pointer transition-colors group ${
        active && expanded ? "text-white" : "text-black"
      } 
      ${
        active && expanded
          ? "bg-sky-500 "
          : // ? "bg-gradient-to-tr from-orange-500 to-yellow-200   text-white "
            "hover:bg-sky-100"
      }
      
            `}
    >
      <div>{icon}</div>
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0 ml-3"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 h-2 w-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {/* {!expanded && (
        <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-gover : transition-x-0"></div>
      )} */}
    </li>
  );
}
