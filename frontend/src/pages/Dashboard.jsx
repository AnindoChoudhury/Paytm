import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate(); 
  const users = [
    {
      firstname: "Anindo",
      lastname: "Choudhury",
      username: "ani",
      userID: "1438",
    },
    {
      firstname: "Aditya",
      lastname: "Ghosh",
      username: "adi",
      userID: "74389",
    },
    {
      firstname: "Prothoma",
      lastname: "Sarkar",
      username: "pro",
      userID: "8oeu",
    },
  ];
  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          The Payment App
        </h3>
        <Button variant="outline">User</Button>
      </div>
      <div className="mt-[4rem]">
        <h2 className="scroll-m-20 text-lg font-semibold tracking-tight">
          Balance Rs.2000
        </h2>
        <Input className="mt-4" type="email" placeholder="search users" />
        <div className="mt-10">
          {users.map((item) => {
            return (
              <div key={item.userID} className="flex justify-between mb-4">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <p className="text-sm flex items-center font-medium leading-none">{`${item.firstname} ${item.lastname}`}</p>
                </div>
                <div className="flex justify-end items-center">
                  <Button onClick={()=>
                {
                    navigate("/send")
                }}>Send money</Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
