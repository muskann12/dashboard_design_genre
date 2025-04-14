"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";


export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email === process.env.ADMIN_PANNEL_EMAIL && password === process.env.ADMIN_PANNEL_PASSWORD ) {
      Cookies.set("authToken", "your-secret-token", { expires: 1 });
      localStorage.setItem("adminUsername", username);
      router.push("/");
    } else {
      alert("Invalid credentials");
    }
  };
  
  return (
    <div className="min-h-screen flex font-clash items-center justify-center  bg-gradient-to-br from-blue-950 to-gray-600">
      <div className="bg-lightGray p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-darkPrimary border-b-2 pb-1 border-blue-950 tracking-wide">Login <span className="text-blue-500 rounded-lg bg-gray-950/5 p-2 mb-2">Design Genre</span> Admin Panel</h2>
        <h5 className="text-lg font-bold mb-6 text-center text-red-500">Warning: This section is for Admins only! ⚠</h5>
        <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-2">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-950"
          />
        </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-950 "
              required
            />
          </div>
          <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">Password:</label>
          <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-950"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="relative top-[-1.8rem] left-[22rem] h-4 inset-y-0 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full bg-gradient-to-br from-blue-950 to-gray-500 text-white px-4 py-2 rounded-md  hover:bg-gray-900 focus:outline-none focus:ring-2 "
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}