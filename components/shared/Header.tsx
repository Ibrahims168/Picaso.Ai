import React from "react";

const Header = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  return (
    <>
      <h2 className="text-2xl font-bold text-dark-600">{title}</h2>
      {subtitle && <p className="text-base mt-4 text-gray-600">{subtitle}</p>}
    </>
  );
};

export default Header;
