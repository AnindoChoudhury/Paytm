import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

export default function Dashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [balance, setBalance] = useState(""); 
  async function Call() {
    try {
     const underscoredFilter = filter.padStart(filter.length+1,'_'); 
      const url = `http://localhost:3000/api/v1/user/bulk?filter=${underscoredFilter}`; 
      const res = await axios.get(url,{
        headers : 
        {
          Authorization : "Bearer "+localStorage.getItem("token"),
          "Content-Type" : "application/json", 
        }
      });
      setUsers([...res.data.users]);
    } catch (err) {
       console.log(err);
    }
  }
  const fetchBalance = async () =>
  {
    const res = await axios.get("http://localhost:3000/api/v1/account/balance",{
      headers : {
        Authorization : "Bearer "+localStorage.getItem("token"),
      }
    })
     setBalance(res.data.balance); 
  }
  let id; 
  const debounceSearchRequest = (query) =>
  {
    clearTimeout(id); 
    id = setTimeout(()=>
    {
      setFilter(query); 
    },600); 
  }
  // Pushes dashboardLoadStatus in the localstorage when dashboard loads for the first time. 
  useEffect(() => {
    if (!localStorage.getItem("dashboardLoadStatus"))
      toast(`Welcome ${localStorage.getItem("username")}`);
    localStorage.setItem("dashboardLoadStatus", "true");
    fetchBalance(); 
  }, []);
  useEffect(() => {
    Call();
  }, [filter]);
  return (
    <div className="p-4">
      <Toaster position="top-center" />

      <div className="flex justify-between items-center">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          The Payment App
        </h3>
        <Button variant="outline">You</Button>
      </div>
      <div className="mt-[4rem]">
        <h2 className="scroll-m-20 text-lg font-semibold tracking-tight">
          Balance Rs {balance}
        </h2>
        <Input
          className="mt-4"
          type="email"
          placeholder="search users"
          onChange={(e) => {
            debounceSearchRequest(e.target.value); 
          }}
        />
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
                  <Button
                    onClick={() => {
                      navigate(`/send?id=${item.userID}&firstname=${item.firstname}&lastname=${item.lastname}`);
                    }}
                  >
                    Send money
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
