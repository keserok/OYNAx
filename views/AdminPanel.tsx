import React, { useState, useEffect } from 'react';
import { Users, Shield, Scale, MapPin, Plus, Edit2, Trash2, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'PLAYERS' | 'GOALKEEPERS' | 'REFEREES' | 'PITCHES'>('PITCHES');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Real Data State
  const [pitches, setPitches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    image: '',
    rating: 0,
    grassQuality: 0,
    lighting: 0,
    lockerRoomQuality: 0,
    amenities: '', // Comma separated for simple input
  });

  // Fetch Data on Mount
  useEffect(() => {
    fetchPitches();
  }, []);

  const fetchPitches = async () => {
    try {
      const response = await fetch('/api/pitches');
      const data = await response.json();
      // Parse JSON fields
      const parsedData = data.map((p: any) => ({
        ...p,
        amenities: p.amenities ? JSON.parse(p.amenities) : [],
        courts: p.courts ? JSON.parse(p.courts) : []
      }));
      setPitches(parsedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pitches:', error);
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      location: '',
      price: '',
      image: '',
      rating: 0,
      grassQuality: 0,
      lighting: 0,
      lockerRoomQuality: 0,
      amenities: ''
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (pitch: any) => {
    setEditingId(pitch.id);
    setFormData({
      name: pitch.name,
      location: pitch.location,
      price: pitch.price,
      image: pitch.image || '',
      rating: pitch.rating || 0,
      grassQuality: pitch.grassQuality || 0,
      lighting: pitch.lighting || 0,
      lockerRoomQuality: pitch.lockerRoomQuality || 0,
      amenities: pitch.amenities ? pitch.amenities.join(', ') : ''
    });
    setShowAddModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.location) return;
    
    const payload = {
      ...formData,
      amenities: formData.amenities.split(',').map(s => s.trim()).filter(Boolean),
      courts: [] // Keeping simple for now
    };

    try {
      let response;
      if (editingId) {
        // Update
        response = await fetch(`/api/pitches/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Create
        response = await fetch('/api/pitches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      
      if (response.ok) {
        fetchPitches(); // Refresh list
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Error saving pitch:', error);
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm('Bu sahayı silmek istediğinize emin misiniz?')) return;
    try {
      const response = await fetch(`/api/pitches/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setPitches(pitches.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Error deleting pitch:', error);
    }
  };

  const tabs = [
    { id: 'PITCHES', label: 'Sahalar', icon: MapPin },
    { id: 'PLAYERS', label: 'Oyuncular', icon: Users },
    { id: 'GOALKEEPERS', label: 'Kaleciler', icon: Shield },
    { id: 'REFEREES', label: 'Hakemler', icon: Scale },
  ];

  return (
    <div className="h-full bg-[#0A0E14] text-white font-sans flex flex-col relative">
      
      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#161B22] border border-white/10 p-6 rounded-3xl w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
            <h3 className="text-xl font-black uppercase">{editingId ? 'Sahayı Düzenle' : 'Yeni Saha Ekle'}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs text-gray-500 font-bold uppercase">Saha Adı</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-[#FFFF00] outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase">Konum (İlçe)</label>
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-[#FFFF00] outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase">Fiyat</label>
                <input 
                  type="text" 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-[#FFFF00] outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-500 font-bold uppercase">Resim URL</label>
                <input 
                  type="text" 
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-[#FFFF00] outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase">Puan (0-5)</label>
                <input 
                  type="number" 
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-[#FFFF00] outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase">Zemin (0-100)</label>
                <input 
                  type="number" 
                  value={formData.grassQuality}
                  onChange={(e) => setFormData({...formData, grassQuality: Number(e.target.value)})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-[#FFFF00] outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-500 font-bold uppercase">Özellikler (Virgülle ayırın)</label>
                <input 
                  type="text" 
                  placeholder="Otopark, Duş, Wifi..."
                  value={formData.amenities}
                  onChange={(e) => setFormData({...formData, amenities: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-[#FFFF00] outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 font-bold transition-colors">İptal</button>
              <button onClick={handleSubmit} className="flex-1 py-3 rounded-xl bg-[#FFFF00] text-black font-black hover:bg-[#FFFF00]/90 transition-colors">
                {editingId ? 'Güncelle' : 'Ekle'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden rounded-3xl border border-white/5 bg-[#161B22]/50">
        {/* Sidebar */}
        <div className="w-20 lg:w-64 bg-[#161B22] border-r border-white/5 flex flex-col py-6 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-4 px-6 py-4 transition-all ${isActive ? 'bg-[#FFFF00]/10 border-r-4 border-[#FFFF00] text-[#FFFF00]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
              >
                <Icon size={24} />
                <span className="hidden lg:block text-sm font-bold tracking-widest uppercase">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black uppercase tracking-tighter">
              {tabs.find(t => t.id === activeTab)?.label} Yönetimi
            </h2>
            <button 
              onClick={handleOpenAdd}
              className="h-12 px-6 bg-[#FFFF00] text-black font-black text-xs tracking-widest rounded-2xl flex items-center gap-2 hover:bg-white transition-all"
            >
              <Plus size={16} /> YENİ EKLE
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input 
              type="text" 
              placeholder="Ara..." 
              className="w-full h-14 bg-[#161B22] border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFFF00]/50 transition-all"
            />
          </div>

          {/* Data Table / List */}
          <div className="bg-[#161B22] border border-white/5 rounded-3xl overflow-hidden">
            {activeTab === 'PITCHES' ? (
              <div className="divide-y divide-white/5">
                {pitches.map((pitch) => (
                  <div key={pitch.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-black rounded-xl border border-white/10 overflow-hidden">
                        {pitch.image ? (
                          <img src={pitch.image} alt={pitch.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                             <MapPin size={20} className="text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-black text-white uppercase">{pitch.name}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{pitch.location} • {pitch.price}</p>
                        <div className="flex gap-1 mt-1">
                          {pitch.amenities?.slice(0, 3).map((a: string, i: number) => (
                            <span key={i} className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-gray-400">{a}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleOpenEdit(pitch)}
                        className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center hover:bg-blue-500/20 transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteItem(pitch.id)}
                        className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {pitches.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    Kayıt bulunamadı.
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500 font-bold text-sm">
                <p className="mb-2">Bu alan yapım aşamasındadır.</p>
                <p className="text-[10px] uppercase tracking-widest">Yakında {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} ekleme, düzenleme ve silme işlemleri buradan yapılabilecek.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
