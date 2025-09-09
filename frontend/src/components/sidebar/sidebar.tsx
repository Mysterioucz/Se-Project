import React, { ReactNode } from "react";

interface SidebarProps {
  children?: ReactNode;
  width?: string;
  height?: string;
}

export default function Sidebar({ children, width = "250px", height = "100%" }: SidebarProps) {
  return (
    <div
      className={`flex flex-col items-start p-6 gap-2 rounded-sm bg-white`}
      style={{ width, height }}
    >
      {children}
    </div>
  );
}
