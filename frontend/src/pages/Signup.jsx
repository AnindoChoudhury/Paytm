import * as React from "react";

import { Button } from "@/components/ui/button";
import axios from "axios";
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

export default function Signup() {
  const navigate = useNavigate();
  const firstnameRef = useRef(null);
  const lastnameRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const [response, setResponse] = useState("");

  return (
    <div className="flex justify-center items-center h-[100vh]">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Signup</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Input
                  ref={firstnameRef}
                  id="firstname"
                  placeholder="firstname"
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input
                  required
                  ref={lastnameRef}
                  id="lastname"
                  placeholder="lastname"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input
                  ref={usernameRef}
                  required
                  id="username"
                  placeholder="username"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input
                  ref={passwordRef}
                  required
                  id="password"
                  placeholder="password"
                />
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
                firstname: firstnameRef.current.value,
                lastname: lastnameRef.current.value,
                username: usernameRef.current.value,
                password: passwordRef.current.value,
              };
              try {
                const res = await axios.post(
                  "http://localhost:3000/api/v1/user/signup",
                  reqBody,
                  {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );
                setResponse("");
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("username",res.data.username); 
                localStorage.setItem("dashboardLoadStatus",""); 
                navigate("/dashboard")
              } catch (err) {
                setResponse(err.response.data.msg);
              }
            }}
          >
            Signup
          </Button>
          <Button
            variant="link"
            onClick={() => {
              navigate("/signin");
            }}
          >
            Already have an account?
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
