// By: Tobiasahlin (spinkit)
import { twMerge } from "tailwind-merge";
import "./index.css";

// Selector to change color:
//      .sk-circle .sk-child:before
// Property to change color:
//      background-color
export default function SpinnerSkCircle({ className }: { className?: string }) {
  return (
    <div
      className={twMerge(
        "sk-circle [&_.sk-child:before]:!bg-theme-4",
        className
      )}
    >
      <div className="sk-circle1 sk-child"></div>
      <div className="sk-circle2 sk-child"></div>
      <div className="sk-circle3 sk-child"></div>
      <div className="sk-circle4 sk-child"></div>
      <div className="sk-circle5 sk-child"></div>
      <div className="sk-circle6 sk-child"></div>
      <div className="sk-circle7 sk-child"></div>
      <div className="sk-circle8 sk-child"></div>
      <div className="sk-circle9 sk-child"></div>
      <div className="sk-circle10 sk-child"></div>
      <div className="sk-circle11 sk-child"></div>
      <div className="sk-circle12 sk-child"></div>
    </div>
  );
}
