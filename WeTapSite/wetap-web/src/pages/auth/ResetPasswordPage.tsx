import React, { useState } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import logoImg from '../../layouts/logo.png';
import { useResetPasswordMutation } from "../../services/api/apiAccount";
import LoadingOverlay from "../../components/ui/loading/LoadingOverlay";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = decodeURIComponent(searchParams.get("token") ?? "");
  const email = decodeURIComponent(searchParams.get("email") ?? "");

  const [errorMessage, setErrorMessage] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long!");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      await resetPassword({ newPassword: formData.newPassword, token, email }).unwrap();
      setErrorMessage("");
      navigate("/login");
    } catch (err) {
      setErrorMessage("An error occurred while resetting the password");
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg))] text-[rgb(var(--color-zinc-50))] flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {isLoading && <LoadingOverlay />}

      {/* 1. РОЖЕВО-ЧЕРВОНА ПЛЯМА (Зліва вгорі) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-[110%] -translate-y-1/2 w-[30rem] h-[30rem] bg-[#ff2a6d]/25 rounded-full blur-[120px] pointer-events-none" />

      {/* 2. СИНЯ ПЛЯМА (Справа внизу) */}
      <div className="absolute bottom-1/4 left-1/2 translate-x-[10%] translate-y-1/2 w-[30rem] h-[30rem] bg-[#3b82f6]/25 rounded-full blur-[120px] pointer-events-none" />

      {/* Центрована картка */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-[rgb(var(--color-zinc-950)/0.8)] backdrop-blur-xl border border-[rgb(var(--color-zinc-700))] rounded-3xl p-8 shadow-2xl z-10 flex flex-col items-center transition-colors duration-300"
      >
        {/* Logo / Header */}
        <div className="flex items-center gap-2 mb-8">
          <img src={logoImg} alt="WeTap Logo" className="h-8 w-auto object-contain" />
          <span className="text-2xl font-bold tracking-tight text-[#ff2a6d]">WeTap</span>
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-2xl font-bold text-center mb-1 text-[rgb(var(--color-zinc-50))]">Create new password</h1>
        <p className="text-[rgb(var(--color-zinc-400))] text-xs text-center mb-6">
          Your new password must be different from previous used passwords
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* NEW PASSWORD */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[rgb(var(--color-zinc-200))]">New Password</label>
            <div className="relative flex items-center">
              <input
                type={showNewPassword ? "text" : "password"}
                required
                placeholder="Enter your new password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full bg-[rgb(var(--color-zinc-800))] text-[rgb(var(--color-zinc-50))] placeholder-[rgb(var(--color-zinc-400))] pl-4 pr-11 py-2.5 rounded-full text-sm outline-none border border-[rgb(var(--color-zinc-700))] focus:border-[#ff2a6d] focus:ring-2 focus:ring-[#ff2a6d] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 text-[rgb(var(--color-zinc-400))] hover:text-[rgb(var(--color-zinc-50))] transition-colors"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[rgb(var(--color-zinc-200))]">Confirm Password</label>
            <div className="relative flex items-center">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full bg-[rgb(var(--color-zinc-800))] text-[rgb(var(--color-zinc-50))] placeholder-[rgb(var(--color-zinc-400))] pl-4 pr-11 py-2.5 rounded-full text-sm outline-none border border-[rgb(var(--color-zinc-700))] focus:border-[#ff2a6d] focus:ring-2 focus:ring-[#ff2a6d] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 text-[rgb(var(--color-zinc-400))] hover:text-[rgb(var(--color-zinc-50))] transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {errorMessage && (
            <p className="text-red-500 text-xs font-medium text-center pt-1">{errorMessage}</p>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full bg-[#ff2a6d] hover:bg-[#e0245e] text-white font-semibold py-2.5 rounded-full text-sm transition-all shadow-md shadow-[#ff2a6d]/20 mt-2 cursor-pointer"
          >
            Reset password
          </button>
        </form>

        {/* BACK TO SIGN IN */}
        <p className="text-xs text-[rgb(var(--color-zinc-400))] mt-6">
          Back to{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-[#ff2a6d] hover:underline font-medium cursor-pointer"
          >
            Sign in
          </button>
        </p>
      </motion.div>
    </div>
  );
}

export default ResetPasswordPage;
