import { PacmanLoader } from "react-spinners";
function Spinner() {
    return (
        <div className="flex justify-center absolute items-center top-0 right-0 left-0 bottom-0 z-50 ">
            <PacmanLoader  />
        </div>
    );
}

export default Spinner;