import Navigation from "./Navigation";
import { Outlet } from "react-router-dom";

export default function LayoutWithNav() {
  return (
    <>
      <Navigation />
      <Outlet />
    </>
  );
}
