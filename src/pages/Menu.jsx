import { useState } from 'react';
import { ShoppingBag, Phone, MapPin, Star, Plus, Minus, X, ChefHat, Search, ArrowRight, CheckCircle, User, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MENU (Images locales) ---
const MENU = [
  { id: 1, category: "Plats Résistants", name: "Ndolè Royal Crevettes", price: 4500, desc: "Feuilles de Ndolè, arachides, crevettes fraîches et miondo.", image: "/ndole.jpg" },
  { id: 2, category: "Plats Résistants", name: "Poulet DG", price: 6000, desc: "Poulet frit, plantains mûrs, légumes croquants.", image: "/poulet-dg.jpg" },
  { id: 3, category: "Plats Résistants", name: "Eru & Waterfufu", price: 4000, desc: "Eru cuisiné à l'huile rouge avec peau de bœuf et waterfufu.", image: "/eru.jpg" },
  { id: 4, category: "Grillades", name: "Poisson Braisé", price: 5000, desc: "Carpe fraîche braisée aux épices du pays avec bâtons de manioc.", image: "/poisson.jpg" },
  { id: 5, category: "Grillades", name: "Soya (Brochettes)", price: 2000, desc: "5 Brochettes de bœuf épicées façon Haoussa.", image: "/soya.jpg" },
  { id: 6, category: "Boissons", name: "Jus Naturel (Foléré)", price: 1000, desc: "Jus d'oseille frais, menthe et citron.", image: "/folere.jpg" },
  { id: 7, category: "Boissons", name: "Top Pamplemousse", price: 600, desc: "La boisson nationale bien glacée.", image: "/top.jpg" },
];

export default function Menu() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [category, setCategory] = useState("Tout");
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState({ nom: "", quartier: "", repere: "", phone: "" });

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (item) => {
    const existing = cart.find(x => x.id === item.id);
    if (existing) {
      setCart(cart.map(x => x.id === item.id ? { ...x, qty: x.qty + 1 } : x));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
    showToast(`Ajouté : ${item.name}`);
  };

  const updateQty = (id, delta) => {
    setCart(cart.map(item => item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item).filter(item => item.qty > 0));
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const filteredMenu = MENU.filter(item => (category === "Tout" || item.category === category) && item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const sendOrderToWhatsApp = (e) => {
    e.preventDefault();
    let message = `*COMMANDE KMER-DELICE* 🥗%0A👤 ${deliveryInfo.nom}%0A📞 ${deliveryInfo.phone}%0A📍 ${deliveryInfo.quartier} (${deliveryInfo.repere})%0A----------------%0A`;
    cart.forEach(i => message += `▫️ ${i.qty}x ${i.name} : ${i.price * i.qty} F%0A`);
    message += `----------------%0A💰 *TOTAL: ${total} FCFA*`;
    window.open(`https://wa.me/237699999999?text=${message}`, '_blank');
    setCart([]); setIsCheckoutOpen(false); setIsCartOpen(false); showToast("Commande envoyée !");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 bg-white/90 backdrop-blur-md shadow-sm z-40 px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 p-2 rounded-xl text-white shadow-lg shadow-orange-500/30">
            <ChefHat size={22} />
          </div>
          <span className="font-extrabold text-xl text-gray-800">Kmer<span className="text-orange-500">Delice</span></span>
        </div>
        
        <div className="hidden md:block relative w-96">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input type="text" placeholder="Rechercher..." className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:ring-2 focus:ring-orange-500 outline-none transition" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsCartOpen(true)} className="relative p-2.5 bg-gray-100 rounded-full hover:bg-orange-50 transition">
          <ShoppingBag size={22} className="text-gray-700" />
          {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">{cart.reduce((a, b) => a + b.qty, 0)}</span>}
        </motion.button>
      </nav>

      {/* MOBILE SEARCH */}
      <div className="md:hidden px-4 py-2 bg-white border-b">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input type="text" placeholder="Rechercher..." className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:ring-2 focus:ring-orange-500 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {/* HERO BANNER */}
      {!searchTerm && (
        <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative h-48 md:h-64 bg-gray-900 overflow-hidden mx-4 md:mx-6 mt-4 rounded-3xl shadow-lg">
          <img src="/poulet-dg.jpg" alt="Banner" className="w-full h-full object-cover opacity-60" onError={(e) => e.target.src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1920"} />
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 text-white">
            <motion.span initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-orange-500 text-xs font-bold px-2 py-1 rounded w-fit mb-2">PROMO -20%</motion.span>
            <motion.h1 initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-2xl md:text-5xl font-bold mb-2">Saveurs du Mboa 🇨🇲</motion.h1>
            <motion.p initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="text-sm md:text-lg opacity-90">Livraison rapide à Yaoundé & Douala</motion.p>
          </div>
        </motion.header>
      )}

      {/* CATEGORIES */}
      <div className="sticky top-[70px] md:top-[80px] bg-gray-50/95 backdrop-blur z-30 py-4 px-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {["Tout", "Plats Résistants", "Grillades", "Boissons"].map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} className={`px-5 py-2 rounded-full mr-3 text-sm font-bold transition transform hover:scale-105 ${category === cat ? 'bg-orange-600 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* MENU GRID (Avec Animations layout) */}
      <motion.main layout className="px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredMenu.map(item => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.9 }}
              key={item.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group flex flex-col"
            >
              <div className="h-48 overflow-hidden relative">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" onError={(e) => e.target.src="https://via.placeholder.com/400x300?text=Plat"} />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold shadow flex items-center gap-1"><Star size={12} className="text-yellow-500 fill-yellow-500" /> 4.8</div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-800 leading-tight">{item.name}</h3>
                  <span className="font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg text-sm whitespace-nowrap">{item.price} F</span>
                </div>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{item.desc}</p>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => addToCart(item)} className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition flex items-center justify-center gap-2 shadow-lg shadow-gray-900/10">
                  <Plus size={18} /> Ajouter
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.main>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-3">
            <CheckCircle size={20} className="text-green-400" />
            <span className="font-medium text-sm">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PANIER SLIDE-OVER */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
              <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold flex items-center gap-2"><ShoppingBag className="text-orange-500"/> Mon Panier</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-200 rounded-full"><X size={24}/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="text-center text-gray-400 mt-20 flex flex-col items-center">
                    <ShoppingBag size={48} className="opacity-20 mb-4" />
                    <p>Votre panier est vide.</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <motion.div layout key={item.id} className="flex gap-4 items-center bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                      <img src={item.image} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                        <p className="text-orange-600 font-bold text-sm">{item.price * item.qty} F</p>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                        <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-white rounded"><Minus size={14}/></button>
                        <span className="font-bold text-sm w-4 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-white rounded"><Plus size={14}/></button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
              {cart.length > 0 && (
                <div className="p-6 border-t bg-gray-50">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-500">Total</span>
                    <span className="text-2xl font-extrabold text-gray-900">{total} FCFA</span>
                  </div>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => setIsCheckoutOpen(true)} className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition flex items-center justify-center gap-2 shadow-lg">
                    Commander <ArrowRight size={20} />
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CHECKOUT MODAL */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-4 sm:p-0">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsCheckoutOpen(false)} />
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-orange-600 p-6 text-white text-center">
                <h3 className="text-xl font-bold">Où doit-on livrer ? 🛵</h3>
              </div>
              <form onSubmit={sendOrderToWhatsApp} className="p-6 space-y-4">
                {['nom', 'phone', 'quartier'].map(field => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
                    <div className="relative">
                      {field === 'nom' ? <User className="absolute left-3 top-3 text-gray-400" size={18} /> : field === 'phone' ? <Phone className="absolute left-3 top-3 text-gray-400" size={18} /> : <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />}
                      <input required type={field === 'phone' ? 'tel' : 'text'} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" value={deliveryInfo[field]} onChange={e => setDeliveryInfo({...deliveryInfo, [field]: e.target.value})} />
                    </div>
                  </div>
                ))}
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsCheckoutOpen(false)} className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">Annuler</button>
                  <button type="submit" className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-lg">
                    <Phone size={20} /> Envoyer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}