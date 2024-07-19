// By: Tobiasahlin (spinkit)
import { twMerge } from "tailwind-merge";
import "./index.css";

// Selector to change color:
//      .sk-fading-circle .sk-circle:before
// Property to change color:
//      background-color
export default function SpinnerSkCircle({ className }: { className?: string }) {
  return (
    <div
      className={twMerge(
        "sk-fading-circle [&_.sk-circle:before]:!bg-theme-4",
        className
      )}
    >
      <div className="sk-circle1 sk-circle"></div>
      <div className="sk-circle2 sk-circle"></div>
      <div className="sk-circle3 sk-circle"></div>
      <div className="sk-circle4 sk-circle"></div>
      <div className="sk-circle5 sk-circle"></div>
      <div className="sk-circle6 sk-circle"></div>
      <div className="sk-circle7 sk-circle"></div>
      <div className="sk-circle8 sk-circle"></div>
      <div className="sk-circle9 sk-circle"></div>
      <div className="sk-circle10 sk-circle"></div>
      <div className="sk-circle11 sk-circle"></div>
      <div className="sk-circle12 sk-circle"></div>
    </div>
  );
}
