import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';

export function ContactForm() {
  const { addToast } = useToastStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Custom validation logic to prevent native popups
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      addToast('Proszę wypełnić wszystkie wymagane pola.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      addToast('Proszę podać poprawny adres e-mail.', 'error');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      addToast('Wiadomość została wysłana! Skontaktujemy się z Tobą wkrótce.', 'success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      {/* Informacje kontaktowe */}
      <div className="glass-card p-8 md:p-12 relative overflow-hidden bg-navy-dark/40 border border-white/5 backdrop-blur-xl rounded-2xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-ice/5 blur-[80px] rounded-full mix-blend-screen pointer-events-none"></div>
        
        <h3 className="text-3xl font-heading font-bold text-white mb-8 tracking-wide">Dane kontaktowe</h3>
        
        <div className="space-y-8">
          <a href="tel:+48600605609" className="flex items-start gap-5 group">
            <div className="p-4 rounded-full bg-white/5 border border-white/10 text-ice group-hover:bg-ice group-hover:text-navy transition-colors duration-300 shadow-[0_0_15px_rgba(223,243,255,0.1)] group-hover:shadow-[0_0_20px_rgba(223,243,255,0.4)]">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-widest text-silver-dark mb-1">Zadzwoń do nas</p>
              <p className="text-2xl font-bold text-white tracking-wider group-hover:text-ice transition-colors">+48 600 605 609</p>
            </div>
          </a>
          
          <a href="mailto:willa14.zakopane@gmail.com" className="flex items-start gap-5 group">
            <div className="p-4 rounded-full bg-white/5 border border-white/10 text-ice group-hover:bg-ice group-hover:text-navy transition-colors duration-300 shadow-[0_0_15px_rgba(223,243,255,0.1)] group-hover:shadow-[0_0_20px_rgba(223,243,255,0.4)]">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-widest text-silver-dark mb-1">Napisz e-mail</p>
              <p className="text-lg font-medium text-white tracking-wide group-hover:text-ice transition-colors break-all">willa14.zakopane@gmail.com</p>
            </div>
          </a>
          
          <div className="flex items-start gap-5">
            <div className="p-4 rounded-full bg-white/5 border border-white/10 text-ice shadow-[0_0_15px_rgba(223,243,255,0.1)]">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-widest text-silver-dark mb-1">Lokalizacja</p>
              <p className="text-lg font-medium text-white tracking-wide">ul. Salwatoriańska 14<br/>34-500 Zakopane</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formularz */}
      <div className="glass-card p-8 md:p-12 relative border border-white/10 bg-white/5 backdrop-blur-xl rounded-2xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <img src="/wzor.png" alt="" className="absolute top-0 right-0 w-[400px] h-[400px] opacity-[0.03] animate-spin-slow pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <h3 className="text-3xl font-heading font-bold text-white mb-2 tracking-wide relative z-10">Wyślij zapytanie</h3>
        <p className="text-silver-dark font-light mb-8 relative z-10">Masz pytania o dostępność lub szczegóły oferty? Chętnie pomożemy!</p>
        
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-ice uppercase tracking-widest mb-3">Imię i nazwisko *</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-navy-dark/50 border border-white/20 rounded-xl text-white focus:ring-1 focus:ring-ice focus:border-ice outline-none transition-colors backdrop-blur-md placeholder-silver-dark/50"
                placeholder="Jan Kowalski"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ice uppercase tracking-widest mb-3">Telefon</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-navy-dark/50 border border-white/20 rounded-xl text-white focus:ring-1 focus:ring-ice focus:border-ice outline-none transition-colors backdrop-blur-md placeholder-silver-dark/50"
                placeholder="+48 000 000 000"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-ice uppercase tracking-widest mb-3">E-mail *</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-navy-dark/50 border border-white/20 rounded-xl text-white focus:ring-1 focus:ring-ice focus:border-ice outline-none transition-colors backdrop-blur-md placeholder-silver-dark/50"
              placeholder="twoj@email.com"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-ice uppercase tracking-widest mb-3">Treść zapytania *</label>
            <textarea 
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-navy-dark/50 border border-white/20 rounded-xl text-white focus:ring-1 focus:ring-ice focus:border-ice outline-none transition-colors backdrop-blur-md placeholder-silver-dark/50 resize-none"
              placeholder="Napisz, jaki termin i pokój Cię interesuje..."
            ></textarea>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-ice hover:bg-white text-navy flex items-center justify-center gap-2 py-4 font-bold rounded-xl transition-all duration-300 uppercase tracking-widest text-sm shadow-[0_0_15px_rgba(223,243,255,0.3)] hover:shadow-[0_0_25px_rgba(223,243,255,0.6)] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-navy border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>Wyślij wiadomość <Send className="h-4 w-4" /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}