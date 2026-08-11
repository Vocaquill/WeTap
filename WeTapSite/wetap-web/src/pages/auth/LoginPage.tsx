import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import logoImg from '../../layouts/logo.png';
import { useLoginByGoogleMutation, useLoginMutation } from "../../services/api/apiAccount";
import { useGoogleLogin } from '@react-oauth/google';
import LoadingOverlay from "../../components/ui/loading/LoadingOverlay";
import type { ServerError } from "../../types/Account/ServerError.ts";
import type { ILogin } from "../../types/Account/ILogin.ts";

function LoginPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState<ILogin>({
    email: '',
    password: '',
  });

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [loginByGoogle, { isLoading: isGoogleLoading }] = useLoginByGoogleMutation();

  /* ================= EMAIL / PASSWORD LOGIN ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      await login(formData).unwrap();
      navigate('/');
    } catch (err: any) {
      setErrorMessage(err?.data?.message || 'Помилка авторизації');
    }
  };

  /* ================= GOOGLE LOGIN ================= */
  const loginUseGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setErrorMessage("");

      try {
        await loginByGoogle(tokenResponse.access_token).unwrap();
        navigate('/');
      } catch (error) {
        const serverError = error as ServerError;

        if (serverError?.status === 400) {
          setErrorMessage('Помилка входу через Google');
        } else {
          setErrorMessage('Сталася помилка при вході');
        }
      }
    },
  });

  const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg))] text-[rgb(var(--color-zinc-50))] flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {(isLoginLoading || isGoogleLoading) && <LoadingOverlay />}

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
        <div className="flex items-center gap-2 mb-6">
          <img src={logoImg} alt="WeTap Logo" className="h-8 w-auto object-contain" />
          <span className="text-2xl font-bold tracking-tight text-[#ff2a6d]">WeTap</span>
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-2xl font-bold text-center mb-1 text-[rgb(var(--color-zinc-50))]">З поверненням</h1>
        <p className="text-[rgb(var(--color-zinc-400))] text-xs text-center mb-6">
          Раді бачити вас знову! Будь ласка, введіть свої дані.
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* EMAIL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[rgb(var(--color-zinc-200))]">Електронна пошта</label>
            <input
              type="email"
              required
              placeholder="Введіть ваш email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-[rgb(var(--color-zinc-800))] text-[rgb(var(--color-zinc-50))] placeholder-[rgb(var(--color-zinc-400))] px-4 py-2.5 rounded-full text-sm outline-none border border-[rgb(var(--color-zinc-700))] focus:border-[#ff2a6d] focus:ring-2 focus:ring-[#ff2a6d] transition-all"
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[rgb(var(--color-zinc-200))]">Пароль</label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Введіть ваш пароль"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-[rgb(var(--color-zinc-800))] text-[rgb(var(--color-zinc-50))] placeholder-[rgb(var(--color-zinc-400))] pl-4 pr-11 py-2.5 rounded-full text-sm outline-none border border-[rgb(var(--color-zinc-700))] focus:border-[#ff2a6d] focus:ring-2 focus:ring-[#ff2a6d] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-[rgb(var(--color-zinc-400))] hover:text-[rgb(var(--color-zinc-50))] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {errorMessage && (
            <p className="text-red-500 text-xs font-medium text-center">{errorMessage}</p>
          )}

          {/* REMEMBER ME & FORGOT PASSWORD */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded-full accent-[#ff2a6d] cursor-pointer"
              />
              <span className="text-[rgb(var(--color-zinc-300))] font-medium">Запам'ятати мене</span>
            </label>

            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-[#ff2a6d] hover:underline font-medium"
            >
              Забули пароль?
            </button>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full bg-[rgb(var(--color-zinc-100))] hover:bg-[rgb(var(--color-zinc-50))] text-[rgb(var(--color-zinc-950))] font-semibold py-2.5 rounded-full text-sm transition-all shadow-md mt-2 cursor-pointer"
          >
            Увійти
          </button>
        </form>

        {/* GOOGLE BUTTON */}
        <button
          type="button"
          onClick={() => loginUseGoogle()}
          className="w-full bg-[rgb(var(--color-zinc-900))] hover:bg-[rgb(var(--color-zinc-800))] text-[rgb(var(--color-zinc-50))] font-semibold py-2.5 rounded-full text-sm transition-all flex items-center justify-center gap-2 mt-3 shadow-sm border border-[rgb(var(--color-zinc-700))] cursor-pointer"
        >
          <GoogleIcon />
          Увійти через Google
        </button>

        {/* REGISTER LINK */}
        <p className="text-xs text-[rgb(var(--color-zinc-400))] mt-6">
          Немає акаунту?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-[#ff2a6d] hover:underline font-medium cursor-pointer"
          >
            Зареєструватися
          </button>
        </p>
      </motion.div>
    </div>
  );
}

export default LoginPage;
