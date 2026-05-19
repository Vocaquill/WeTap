import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Film } from 'lucide-react';

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 overflow-hidden relative">

            <div className="absolute inset-0 z-0 opacity-5 select-none pointer-events-none">
                <div className="whitespace-nowrap text-[20rem] font-black italic uppercase tracking-tighter leading-none">
                    NOT FOUND NOT FOUND NOT FOUND NOT FOUND
                </div>
                <div className="whitespace-nowrap text-[20rem] font-black italic uppercase tracking-tighter leading-none text-red-600">
                    ERROR 404 ERROR 404 ERROR 404 ERROR 404
                </div>
            </div>

            <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03] bg-[url('https://media.giphy.com/media/oEI9uWUPr9WvA8PPmW/giphy.gif')]" />

            <div className="relative z-20 max-w-4xl w-full text-center">

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative inline-block"
                >
                    <h1 className="text-[12rem] md:text-[20rem] font-black italic leading-none tracking-tighter text-red-600 flex items-center justify-center">
                        4
                        <span className="inline-block mx-[-2rem] md:mx-[-4rem] text-white font-outline-4 drop-shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                            0
                        </span>
                        4
                    </h1>

                    <motion.div
                        initial={{ rotate: -10, scale: 0 }}
                        animate={{ rotate: -15, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="absolute top-12 md:top-20 -right-4 md:-right-10 bg-white text-black px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-red-600/20"
                    >
                        Scene cut
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 space-y-6"
                >
                    <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">
                        Упс! Цю сцену <span className="text-red-600">вирізали</span> при монтажі
                    </h2>
                    <p className="text-zinc-500 text-lg md:text-xl max-w-lg mx-auto font-medium">
                        Сторінка, яку ви шукаєте, не потрапила до фінальної версії фільму або переїхала за іншою адресою.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-12">
                        <button
                            onClick={() => navigate('/')}
                            className="w-full sm:w-auto bg-white text-black px-10 py-5 rounded-2xl font-black uppercase text-sm hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 group shadow-2xl"
                        >
                            <Home size={20} className="group-hover:scale-110 transition-transform" />
                            На головну
                        </button>

                        <button
                            onClick={() => navigate(-1)}
                            className="w-full sm:w-auto bg-zinc-900 text-white border border-zinc-800 px-10 py-5 rounded-2xl font-black uppercase text-sm hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={20} />
                            Повернутися
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="mt-10 flex items-center justify-center gap-8 text-zinc-600"
                >
                    <Film size={40} />
                    <div className="h-px w-24 bg-zinc-800" />
                    <div className="font-black italic text-xl tracking-widest">CINEMA ERROR</div>
                    <div className="h-px w-24 bg-zinc-800" />
                    <Film size={40} />
                </motion.div>
            </div>
        </div>
    );
}

export default NotFoundPage;