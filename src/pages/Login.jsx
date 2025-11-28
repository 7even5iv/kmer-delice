import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Phone, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation de connexion
    setTimeout(() => {
      setIsLoading(false);
      navigate('/menu'); // On va vers le menu après connexion
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
      
      {/* IMAGE DE FOND (Dark Food) */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?q=80&w=1920&auto=format&fit=crop" 
          alt="Restaurant Background" 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
      </div>

      {/* CONTENU */}
      <div className="relative z-10 w-full max-w-md p-4">
        
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl animate-in slide-in-from-bottom-10 duration-700">
          
          {/* Logo Animé */}
          <div className="flex justify-center mb-6">
            <div className="bg-orange-500 p-4 rounded-full text-white shadow-lg shadow-orange-500/40 animate-bounce-slow">
              <ChefHat size={40} />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
              Kmer<span className="text-orange-500">Delice</span>
            </h1>
            <p className="text-gray-300 text-sm">Commandez les meilleurs plats du Mboa.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Champ Téléphone (Plus logique pour un resto que l'email) */}
            <div>
              <label className="text-orange-200 text-xs font-bold uppercase tracking-wider ml-1">Votre Numéro</label>
              <div className="relative mt-1">
                <Phone className="absolute left-4 top-3.5 text-orange-500" size={20} />
                <input 
                  type="tel" 
                  required
                  placeholder="699 00 00 00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                />
              </div>
            </div>

            {/* Bouton Connexion */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-xl shadow-orange-600/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" /> Connexion...
                </>
              ) : (
                <>
                  Commencer <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Bouton Invité (Pas obligatoire de se connecter) */}
          <div className="mt-6 text-center">
            <button 
              onClick={() => navigate('/menu')}
              className="text-gray-400 text-sm hover:text-white transition underline underline-offset-4"
            >
              Continuer sans compte
            </button>
          </div>

        </div>
        
        <p className="text-center text-gray-500 text-xs mt-8">© 2025 KmerDelice - FoodTech Cameroun</p>
      </div>
    </div>
  );
}