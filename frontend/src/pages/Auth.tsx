
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from '../components/common/button';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [randomVideo, setRandomVideo] = useState("");

  const navigate = useNavigate();

  // Array di video disponibili
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

  // Seleziona un video casuale all'avvio
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * videos.length);
    setRandomVideo(videos[randomIndex]);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(isLogin ? "Login submitted" : "Account created", {
      email,
      password,
      fullName: isLogin ? undefined : fullName,
      rememberMe,
    });
    navigate("/"); // ✅ Ora punta alla root "/"
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center px-4 md:px-6">
      {/* Video di sfondo */}
      <video key={randomVideo} autoPlay loop muted className="absolute inset-0 w-full h-full object-cover ">
        <source src={randomVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay per migliorare la leggibilità */}
      <div className="absolute inset-0 bg-black/25"></div>

      {/* Card di login */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-4xl md:flex bg-white/10 backdrop-blur-md shadow-lg rounded-lg overflow-hidden"
      >
        {/* Sezione Form */}
        <div className="w-full md:w-1/2 p-6 md:p-8 bg-[linear-gradient(to_top,#fef3c7,#fdd888,#c47f3d)] relative max-w-sm mx-auto md:max-w-full">


          {/* Logo in alto a destra */}
          <img src="/images/logo200.png" alt="Logo" className="absolute top-3 left-4 md:top-3 md:left-4 h-10 md:h-14 rounded-md shadow-md" />

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xl md:text-4xl font-semibold text-gray-800 text-center"
          >
            {isLogin ? "Login" : "Create Account"}
          </motion.h2>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 md:mt-6 space-y-3 md:space-y-4"
            onSubmit={handleSubmit}
          >
            {/* Full Name (solo per registrazione) */}
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

            {/* Email */}
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

            {/* Password */}
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

            {/* Pulsante di invio */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
              <Button type="submit" className="w-full bg-[#d19a66] text-black text-xs md:text-sm py-2 md:py-3 rounded-lg hover:bg-[#d19a66]/70 hover:text-[#752c06] transition">
                {isLogin ? "LOGIN" : "CREATE ACCOUNT"}
              </Button>
            </motion.div>
          </motion.form>

          {/* Switch tra Login e Registrazione */}
          <p className="text-center text-xs md:text-sm text-gray-700 mt-4 md:mt-6">
            {isLogin ? "Non hai un account?" : "Hai già un account?"}{" "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-black/70 font-semibold ">
              {isLogin ? "Crea un nuovo account" : "Sign in"}
            </button>
          </p>
        </div>

        {/* Sezione Immagine (solo su desktop) */}
        <div className="w-1/2 hidden md:block">
          <img src="/images/logo-original-1000.png" alt="logo" className="w-full h-full object-cover " />
        </div>
      </motion.div>
    </div>
  );
}
