import * as React from "react"
 
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import { NavigationOff } from "lucide-react"
export default function Signin() {
    const navigate =  useNavigate();  
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
              <Input id="username" placeholder="username" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Input id="password" placeholder="password" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button className="w-full">Signin</Button>
        <Button onClick={()=>
        {
            navigate("/signup")
        }} variant="link" className="w-full">Create an account</Button>
      </CardFooter>
    </Card>
    </div>
  )
}