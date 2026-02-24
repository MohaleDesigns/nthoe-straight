import { useState } from "react";
import Signin from "./Signin";
import Signup from "./Signup";

export default function Auth() {
    const [display, setDisplay] = useState("signin");

    return (
        <div>
            {display === "signin" ? <Signin setDisplay={setDisplay} /> : <Signup setDisplay={setDisplay} />}
        </div>
    );
}