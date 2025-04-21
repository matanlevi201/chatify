import { ToastContainer } from "react-toastify";
import { useTheme } from "../theme-provider";

function ToastWrapper() {
  const { theme } = useTheme();

  return (
    <ToastContainer
      theme={theme === "dark" ? "dark" : "light"}
      autoClose={2500}
    />
  );
}

export default ToastWrapper;
