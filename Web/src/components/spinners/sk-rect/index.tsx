// By: Tobiasahlin (spinkit)
import { twMerge } from "tailwind-merge";
// import "./index.css";
import "./faster.css";

// Selector to change color:
//      .spinner > div
// Property to change color:
//      background-color
export default function SpinnerSkRect({ className }: { className?: string }) {
  return (
    <div
      className={twMerge("spinner [&.spinner_>_div]:!bg-theme-4", className)}
    >
      <div className="rect1"></div>
      <div className="rect2"></div>
      <div className="rect3"></div>
      <div className="rect4"></div>
      <div className="rect5"></div>
    </div>
  );
}
