import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required!");
      return;
    }
    navigate(`/dashboard`);

    // Call your authentication API here
    console.log("Logging in with:", { email, password });
  };

  return (
    <div className="flex h-screen  bg-[#E8E8E8] px-4">
      <div className="h-[90%] w-full flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl bg-white p-4 md:p-8 shadow-xl">
          <h2 className="mb-4 md:mb-6 text-center text-3xl font-bold text-gray-800">
            Login
          </h2>
          {/* {error && <p className="mb-4 text-center text-red-500">{error}</p>} */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-2 block text-gray-700">Email</label>
              <input
                type="email"
                className="w-full rounded-lg border rounded border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4 relative">
              <label className="mb-2 block text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-lg border rounded border-gray-300 p-3 pr-10 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
               className="mt-4 cursor-pointer w-full px-6 py-3 bg-[#4b4b49] text-white rounded-lg rounded-lg shadow-lg hover:scale-105 transform transition-all"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
