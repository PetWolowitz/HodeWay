import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from '../components/common/button';
import { useAuthStore } from '../store/auth';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [randomVideo, setRandomVideo] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const { signIn, signUp, error } = useAuthStore();

  const videos = [
    "/videos/background1.mp4",
    "/videos/background2.mp4",
    "/videos/background3.mp4",
    "/videos/background4.mp4",
    "/videos/background5.mp4",
    "/videos/background6.mp4",
    "/videos/background7.mp4",
    "/videos/background8.mp4",
    "/videos/background9.mp4",
    "/videos/background10.mp4",
    "/videos/background11.mp4",
    "/videos/background12.mp4",
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * videos.length);
    setRandomVideo(videos[randomIndex]);
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      if (isLogin) {
        await signIn({ email, password });
      } else {
        await signUp({ email, password, fullName });
      }
      navigate("/");
    } catch (error) {
      setErrorMessage(isLogin ?
        "Invalid email or password. Please try again or create an account." :
        "Registration failed. This email may already be in use."
      );
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center px-4 md:px-6">
      <video key={randomVideo} autoPlay loop muted className="absolute inset-0 w-full h-full object-cover">
        <source src={randomVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 bg-black/25"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-4xl md:flex bg-white/10 backdrop-blur-md shadow-lg rounded-lg overflow-hidden"
      >
        <div className="w-full md:w-1/2 p-6 md:p-8 bg-[linear-gradient(to_top,#fef3c7,#fdd888,#c47f3d)] relative max-w-sm mx-auto md:max-w-full">
          <img src="/images/logo200.png" alt="Logo" className="absolute top-3 left-4 md:top-3 md:left-4 h-10 md:h-14 rounded-sm shadow-md" />

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xl md:text-4xl font-semibold text-gray-800 text-center"
          >
            {isLogin ? "Login" : "Create Account"}
          </motion.h2>

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4 text-sm"
              role="alert"
            >
              <span className="block sm:inline">{errorMessage}</span>
            </motion.div>
          )}

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 md:mt-6 space-y-3 md:space-y-4"
            onSubmit={handleSubmit}
          >
            {!isLogin && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                <label className="block text-xs md:text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  className="w-full p-2 md:p-3 mt-1 border rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                />
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
              <label className="block text-xs md:text-sm font-medium text-gray-700">E-mail *</label>
              <input
                type="email"
                className="w-full p-2 md:p-3 mt-1 border font-sans rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-red-400"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
              <label className="block text-xs md:text-sm font-medium text-gray-700">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full p-2 md:p-3 mt-1 border rounded-lg font-sans bg-gray-100 outline-none focus:ring-2 focus:ring-red-400 pr-10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="absolute inset-y-0 right-3 flex items-center text-gray-600" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 md:h-5" /> : <Eye className="h-4 md:h-5" />}
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
              <Button type="submit" className="w-full bg-[#d19a66] text-black text-xs md:text-sm py-2 md:py-3 rounded-lg hover:bg-[#d19a66]/70 hover:text-[#752c06] transition">
                {isLogin ? "LOGIN" : "CREATE ACCOUNT"}
              </Button>
            </motion.div>
          </motion.form>

          <p className="text-center text-xs md:text-sm text-gray-700 mt-4 md:mt-6 ">
            {isLogin ? "Non hai un account?" : "Hai già un account?"}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMessage(null);
              }}
              className="text-black/70 font-semibold text-sm md:text-lg hover:text-black/90 transition pr-2 "
            >
              {isLogin ? "Crea un nuovo account" : "Sign in"}
            </button>
          </p>
        </div>

        <div className="w-1/2 hidden md:block bg-white/10 backdrop-blur-md  rounded-r-xl overflow-hidden p-4 ">
          <div className="h-full flex items-center justify-center" style={{ minHeight: '500px' }}>
            <img
              src="/images/logo-original-1000.png"
              alt="logo"
              className="max-w-full max-h-full object-contain rounded-2xl"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}