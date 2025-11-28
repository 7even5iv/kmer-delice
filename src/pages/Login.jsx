import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Phone, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/menu');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
      
      {/* FOND ANIMÉ (Zoom lent) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img 
          initial={{ scale: 1 }}
          animate={{ scale: 1.1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          src="https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?q=80&w=1920&auto=format&fit=crop" 
          alt="Restaurant Background" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30"></div>
      </div>

      {/* CONTENU */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="relative z-10 w-full max-w-md p-4"
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          
          {/* Logo Animé */}
          <div className="flex justify-center mb-6">
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }}
              className="bg-orange-500 p-4 rounded-full text-white shadow-lg shadow-orange-500/40"
            >
              <ChefHat size={40} />
            </motion.div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
              Kmer<span className="text-orange-500">Delice</span>
            </h1>
            <p className="text-gray-300 text-sm">Les saveurs du Mboa, livrées chez vous.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-orange-200/80 text-xs font-bold uppercase tracking-wider ml-1">Votre Numéro WhatsApp</label>
              <div className="relative mt-1 group">
                <Phone className="absolute left-4 top-3.5 text-orange-500 group-focus-within:text-white transition-colors" size={20} />
                <input 
                  type="tel" 
                  required
                  placeholder="699 00 00 00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:bg-black/60 focus:ring-2 focus:ring-orange-500 transition-all"
                />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
              type="submit" 
              disabled={isLoading}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-orange-600/20"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <>Commander <ArrowRight size={20} /></>}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => navigate('/menu')} className="text-gray-500 text-sm hover:text-white transition">
              Visiter le menu
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}