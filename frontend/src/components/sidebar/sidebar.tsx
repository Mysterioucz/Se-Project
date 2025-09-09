import React, { ReactNode } from "react";

interface SidebarProps {
  children?: ReactNode;
}

export default function Sidebar({children}: SidebarProps) {
  return (
    <div className="flex flex-col items-start w-[250px] p-6 gap-2 rounded-sm bg-white">
      {children}
    </div>
  );
}