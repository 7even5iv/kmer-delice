import { useState, useEffect } from 'react';
import { ShoppingBag, Phone, MapPin, Star, Plus, Minus, X, ChefHat, Search, ArrowRight, CheckCircle, User, Map } from 'lucide-react';

// --- DONNÉES (MENU CAMEROUNAIS) ---
// --- DONNÉES (MENU AVEC IMAGES LOCALES AUTHENTIQUES) ---
const MENU = [
  { 
    id: 1, 
    category: "Plats Résistants", 
    name: "Ndolè Royal Crevettes", 
    price: 4500, 
    desc: "Feuilles de Ndolè, arachides, crevettes fraîches et miondo de Deido.", 
    image: "/ndole.jpg" // L'image doit être dans le dossier public
  },
  { 
    id: 2, 
    category: "Plats Résistants", 
    name: "Poulet DG", 
    price: 6000, 
    desc: "Poulet frit, plantains mûrs, carottes, haricots verts. Le classique des chefs.", 
    image: "/poulet-dg.jpg" 
  },
  { 
    id: 3, 
    category: "Plats Résistants", 
    name: "Eru & Waterfufu", 
    price: 4000, 
    desc: "Eru cuisiné à l'huile rouge avec peau de bœuf, Kanda et Waterfufu.", 
    image: "/eru.jpg" 
  },
  { 
    id: 4, 
    category: "Grillades", 
    name: "Poisson Braisé (Carpe)", 
    price: 5000, 
    desc: "Carpe fraîche braisée aux épices du pays (Djangsang), avec bâtons de manioc.", 
    image: "/poisson.jpg" 
  },
  { 
    id: 5, 
    category: "Grillades", 
    name: "Soya (Brochettes)", 
    price: 2000, 
    desc: "5 Brochettes de bœuf épicées façon Haoussa avec piment en poudre.", 
    image: "/soya.jpg" 
  },
  { 
    id: 6, 
    category: "Boissons", 
    name: "Jus Naturel (Foléré)", 
    price: 1000, 
    desc: "Jus d'oseille frais (Bissap), menthe et un zeste de citron. 50cl.", 
    image: "/folere.jpg" 
  },
  { 
    id: 7, 
    category: "Boissons", 
    name: "Top Pamplemousse", 
    price: 600, 
    desc: "La boisson nationale bien glacée. Grand modèle.", 
    image: "/top.jpg" 
  },
];

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false); // Modal de livraison
  const [category, setCategory] = useState("Tout");
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState(null); // Notification

  // Formulaire de livraison
  const [deliveryInfo, setDeliveryInfo] = useState({
    nom: "",
    quartier: "",
    repere: "",
    phone: ""
  });

  // Afficher une notification temporaire
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // Ajouter au panier
  const addToCart = (item) => {
    const existing = cart.find(x => x.id === item.id);
    if (existing) {
      setCart(cart.map(x => x.id === item.id ? { ...x, qty: x.qty + 1 } : x));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
    showToast(`"${item.name}" ajouté au panier ! 😋`);
  };

  const updateQty = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) return { ...item, qty: Math.max(0, item.qty + delta) };
      return item;
    }).filter(item => item.qty > 0));
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  // Filtrage intelligent (Catégorie + Recherche)
  const filteredMenu = MENU.filter(item => {
    const matchesCategory = category === "Tout" || item.category === category;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // --- LE MESSAGE WHATSAPP (LE CŒUR DU SYSTÈME) ---
  const sendOrderToWhatsApp = (e) => {
    e.preventDefault();
    
    let message = `*NOUVELLE COMMANDE KMER-DELICE* 🥗%0A`;
    message += `---------------------------%0A`;
    message += `👤 *Client:* ${deliveryInfo.nom}%0A`;
    message += `📞 *Tél:* ${deliveryInfo.phone}%0A`;
    message += `📍 *Lieu:* ${deliveryInfo.quartier} (Rép: ${deliveryInfo.repere})%0A`;
    message += `---------------------------%0A%0A`;
    
    message += `*COMMANDE :*%0A`;
    cart.forEach(item => {
      message += `▫️ ${item.qty}x ${item.name} - ${item.price * item.qty} FCFA%0A`;
    });
    
    message += `---------------------------%0A`;
    message += `💰 *TOTAL À PAYER : ${total} FCFA*%0A`;
    message += `---------------------------%0A`;
    message += `Merci de confirmer la livraison !`;

    // Remplace le numéro par le tien ou celui du client fictif
    window.open(`https://wa.me/237690316766?text=${message}`, '_blank');
    
    setCart([]); // Vider le panier
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    showToast("Commande envoyée sur WhatsApp ! 🚀");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24">
      
      {/* --- HEADER --- */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur-md shadow-sm z-40 px-4 md:px-6 py-4 flex justify-between items-center transition-all">
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 p-2 rounded-xl text-white shadow-lg shadow-orange-500/30">
            <ChefHat size={22} />
          </div>
          <span className="font-extrabold text-xl text-gray-800 tracking-tight">Kmer<span className="text-orange-500">Delice</span></span>
        </div>
        
        {/* Barre de recherche (Desktop) */}
        <div className="hidden md:block relative w-96">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un plat (ex: Ndolè)..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:ring-2 focus:ring-orange-500 outline-none text-sm transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative p-2.5 bg-gray-100 rounded-full hover:bg-orange-50 transition active:scale-95"
        >
          <ShoppingBag size={22} className="text-gray-700" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm animate-bounce">
              {cart.reduce((a, b) => a + b.qty, 0)}
            </span>
          )}
        </button>
      </nav>

      {/* Barre de recherche (Mobile) */}
      <div className="md:hidden px-4 py-2 bg-white border-b">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un plat..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:ring-2 focus:ring-orange-500 outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- BANNER --- */}
      {!searchTerm && ( // On cache la bannière si on recherche
        <header className="relative h-48 md:h-64 bg-gray-900 overflow-hidden mx-4 md:mx-6 mt-4 rounded-3xl shadow-lg">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80" 
            alt="Cuisine Camerounaise" 
            className="w-full h-full object-cover opacity-60 hover:scale-105 transition duration-1000"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 text-white">
            <span className="bg-orange-500 text-xs font-bold px-2 py-1 rounded w-fit mb-2">PROMO -20%</span>
            <h1 className="text-2xl md:text-5xl font-bold mb-2">Saveurs du Mboa 🇨🇲</h1>
            <p className="text-sm md:text-lg opacity-90">Livraison rapide à Yaoundé & Douala</p>
          </div>
        </header>
      )}

      {/* --- CATÉGORIES --- */}
      <div className="sticky top-[70px] md:top-[80px] bg-gray-50/95 backdrop-blur z-30 py-4 px-4 md:px-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {["Tout", "Plats Résistants", "Grillades", "Boissons"].map(cat => (
          <button 
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-5 py-2 rounded-full mr-3 text-sm font-bold transition transform hover:scale-105 ${category === cat ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'bg-white text-gray-600 border border-gray-200 shadow-sm'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* --- MENU GRID --- */}
      <main className="px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMenu.map(item => (
          <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col">
            <div className="h-48 overflow-hidden relative">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold shadow flex items-center gap-1">
                <Star size={12} className="text-yellow-500 fill-yellow-500" /> 4.8
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-800 leading-tight">{item.name}</h3>
                <span className="font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg text-sm whitespace-nowrap">{item.price} F</span>
              </div>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{item.desc}</p>
              <button 
                onClick={() => addToCart(item)}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-gray-900/10"
              >
                <Plus size={18} /> Ajouter
              </button>
            </div>
          </div>
        ))}
      </main>
      
      {/* Si aucun résultat */}
      {filteredMenu.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p>Aucun plat trouvé pour "{searchTerm}" 😢</p>
        </div>
      )}

      {/* --- TOAST NOTIFICATION --- */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <CheckCircle size={20} className="text-green-400" />
          <span className="font-medium text-sm">{toast}</span>
        </div>
      )}

      {/* --- PANIER (MODAL) --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold flex items-center gap-2"><ShoppingBag className="text-orange-500"/> Mon Panier</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition"><X size={24}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center text-gray-400 mt-20 flex flex-col items-center">
                  <div className="bg-gray-100 p-6 rounded-full mb-4">
                    <ShoppingBag size={48} className="opacity-20" />
                  </div>
                  <p className="font-medium">Votre panier est vide.</p>
                  <p className="text-sm">Ajoutez des plats délicieux !</p>
                  <button onClick={() => setIsCartOpen(false)} className="mt-6 text-orange-600 font-bold hover:underline">Retourner au menu</button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 items-center bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                      <p className="text-orange-600 font-bold text-sm">{item.price * item.qty} F</p>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                      <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-white rounded shadow-sm transition"><Minus size={14}/></button>
                      <span className="font-bold text-sm w-4 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-white rounded shadow-sm transition"><Plus size={14}/></button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t bg-gray-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500">Total à payer</span>
                  <span className="text-2xl font-extrabold text-gray-900">{total} FCFA</span>
                </div>
                <button 
                  onClick={() => setIsCheckoutOpen(true)} // Ouvre le formulaire de livraison
                  className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 active:scale-95"
                >
                  Commander <ArrowRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL FORMULAIRE DE LIVRAISON (NOUVEAU) --- */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsCheckoutOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0 md:zoom-in-95 duration-300">
            
            <div className="bg-orange-600 p-6 text-white text-center">
              <h3 className="text-xl font-bold">Où doit-on livrer ? 🛵</h3>
              <p className="text-orange-100 text-sm mt-1">Remplissez pour finaliser sur WhatsApp</p>
            </div>

            <form onSubmit={sendOrderToWhatsApp} className="p-6 space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Votre Nom</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input 
                    required
                    type="text" 
                    placeholder="Ex: Loic Ngoumou"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    value={deliveryInfo.nom}
                    onChange={e => setDeliveryInfo({...deliveryInfo, nom: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input 
                    required
                    type="tel" 
                    placeholder="Ex: 699 00 00 00"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    value={deliveryInfo.phone}
                    onChange={e => setDeliveryInfo({...deliveryInfo, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quartier</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                      required
                      type="text" 
                      placeholder="Ex: Bastos"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                      value={deliveryInfo.quartier}
                      onChange={e => setDeliveryInfo({...deliveryInfo, quartier: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Repère (Facultatif)</label>
                <div className="relative">
                  <Map className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Ex: Derrière la pharmacie..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    value={deliveryInfo.repere}
                    onChange={e => setDeliveryInfo({...deliveryInfo, repere: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsCheckoutOpen(false)}
                  className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-lg"
                >
                  <Phone size={20} /> Envoyer
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}