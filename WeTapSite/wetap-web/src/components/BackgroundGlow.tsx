
const BackgroundGlow = () => {
  return (
    // z-[-1] або z-0 залежно від того, які індекси у твого бокового меню
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-black">

      {/* Плями залишаємо, але робимо їх трохи менш яскравими, щоб не "забивали" контент */}
      <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-red-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '10s' }} />

      <div className="absolute bottom-[-5%] right-[-5%] w-[45%] h-[45%] bg-red-900/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '15s' }} />

      {/* Легка текстура шуму для кіно-ефекту */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};

export default BackgroundGlow;
