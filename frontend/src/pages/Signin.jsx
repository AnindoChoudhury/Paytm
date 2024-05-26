import * as React from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
export default function Signin() {
  const navigate = useNavigate();
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [response, setResponse] = useState("");
  return (
    <div className="flex justify-center items-center h-[100vh]">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Signin</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Input ref={usernameRef} id="username" placeholder="username" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input ref={passwordRef} id="password" placeholder="password" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <p className="text-red-500 text-sm mt-0 mb-2">{response}</p>
          <Button
            className="w-full"
            onClick={async () => {
              const reqBody = {
                username: usernameRef.current.value,
                password: passwordRef.current.value,
              }
              console.log(reqBody); 
              try {
                const response = await axios.post(
                  "http://localhost:3000/api/v1/user/signin",
                  reqBody
                );
                setResponse(""); 
                console.log(response.data); 
                localStorage.setItem("username",response.data.username); 
                // removing Load status from localstorage
                localStorage.setItem("dashboardLoadStatus",""); 
                localStorage.setItem("token",response.data.token); 
                navigate("/dashboard");
              } catch (err) {
                setResponse(err.response.data.msg);
                console.log(err); 
              }
            }}
          >
            Signin
          </Button>
          
          <Button
            onClick={() => {
              navigate("/signup");
            }}
            variant="link"
            className="w-full"
          >
            Create an account
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
