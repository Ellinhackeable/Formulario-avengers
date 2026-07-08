import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AvengersForm from "./AvengersForm.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AvengersForm />
  </StrictMode>
);
