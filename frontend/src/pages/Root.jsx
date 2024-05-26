import Signin from "./Signin"
import Dashboard from "./Dashboard"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react";
export default function Root()
{
    const navigate = useNavigate(); 
    useEffect(()=>
    {
        if(!localStorage.getItem("token"))
        navigate("/signin");
        else 
        navigate("/dashboard")
    },[])
}