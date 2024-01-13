import { FormEvent, useState } from "react";

interface ErrorMessage {
  name : string[] , 
  password : string[]
  user : string[]
}
export default function App()  {
  const [formData , setFormData] = useState({ name : "" , password : ""  })
  const [error , setError] = useState<ErrorMessage | null >(null)
  function handleSubmit (e: FormEvent) : void {
    e.preventDefault()
  
    fetch("http://localhost:3200/login", { 
      method : "POST" ,
      body : JSON.stringify(formData) ,
      headers :  { "Content-Type" : "application/json" } ,
      credentials : "include"
    })
    .then( res => res.json())
    .then(data => {
      if (data.errors) {
        console.log(data.errors)
        setError(data.errors)
       
      }else {
        setError(null)
        const payload = data.split(".")[1]
        console.log(JSON.parse(atob(payload)))
      }
      

    })


  }
  return (
      <main className="flex flex-col justify-center w-full items-center ">
        <form
        onSubmit={handleSubmit}
        className="mt-40" >
           <h1 className="text-3xl font-bold"> Login </h1>
           <div className="flex flex-col gap-2 mt-10">
            <label htmlFor=""> Username</label>
            <input value={formData.name} onChange={(e) => 
              setFormData({...formData , name : e.target.value.replace(/\s+/g, "")}) } className="p-2" type="text" />
            <p className="mt-2 capitalize text-red-500 text-sm">{error?.name ?  error.name[0] : null}</p>
           </div>
           <div className="mt-2 flex flex-col gap-2">
            <label htmlFor=""> Password</label>
            <input  value={formData.password} onChange={(e) => setFormData({...formData , password : e.target.value.replace(/\s+/g, "")}) } className="p-2" type="text" />
            <p className="mt-2 capitalize text-red-500 text-sm">{error?.password ?  error.password[0] : null}</p>
           </div>
           <p className="mt-2 capitalize text-red-500 text-sm">{error?.user ?  error.user[0] : null}</p>
           <button className="bg-gray-400 px-4 py-2 rounded mt-4 text-black font-bold hover:bg-gray-800 
           hover:text-white hover:shadow-[0px_0px_5px_1px_black] active:scale-95">
            Login
           </button>
        </form>
      </main>
  )
}

