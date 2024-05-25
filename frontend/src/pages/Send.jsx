import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import{useState, useRef} from "react"
import axios from "axios"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Toaster, toast } from "sonner";

export default function CardWithForm() {
  const [searchParams] = useSearchParams(); 
  const inputRef = useRef(null); 
  return (
    <div className="flex justify-center items-center h-[100vh]">
      <Toaster position="top-center" richColors/>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-center scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-2xl">
            Send money
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex justify-start gap-5">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h3 className="flex items-center scroll-m-20 text-2xl font-semibold tracking-tight">
                  {`${searchParams.get("firstname")} ${searchParams.get("lastname")}`}
                </h3>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input id="name" placeholder="Enter amount in Rs" ref={inputRef}/>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button className="bg-green-500 w-full hover:bg-green-700" onClick={async()=>
          {
            try
            {
               const res = await axios.post("http://localhost:3000/api/v1/account/transfer",
              {
                 toUsernameID : searchParams.get("id"), 
                 amount : +inputRef.current.value, 
              },
              {
                headers : {
                  Authorization : "Bearer "+localStorage.getItem("token")
                }
              })
              toast.success(res.data.msg); 
            }
            catch(err)
            {
              toast.error(err.response.data.msg)
            }
          }
          }>
            Send
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
