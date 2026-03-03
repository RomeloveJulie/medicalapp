import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  LogOut, 
  Globe, 
  LayoutDashboard, 
  PlusCircle, 
  History as HistoryIcon,
  User as UserIcon,
  LogIn,
  Stethoscope,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MedicalForm } from './components/MedicalForm';
import { Dashboard } from './components/Dashboard';
import { User, Submission } from './types';

export default function App() {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'form' | 'dashboard' | 'history'>('form');
  const [editingSubmission, setEditingSubmission] = useState<Submission | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      if (parsed.role === 'staff') setView('dashboard');
    }
  }, []);

  const handleEdit = (submission: Submission) => {
    setEditingSubmission(submission);
    setIsReadOnly(false);
    setView('form');
  };

  const handleView = (submission: Submission) => {
    setEditingSubmission(submission);
    setIsReadOnly(true);
    setView('form');
  };

  const handleFormSuccess = () => {
    if (!isReadOnly) {
      alert(t('success_msg'));
    }
    setEditingSubmission(null);
    setIsReadOnly(false);
    setView('history');
  };

  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isIOS && !isStandalone) {
      setShowInstallPrompt(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    
    // Simulate role check based on STAFF_EMAILS
    const isStaff = emailInput.includes('staff') || emailInput === 'trthuong2711@gmail.com';
    const newUser: User = { email: emailInput, role: isStaff ? 'staff' : 'patient' };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    if (isStaff) setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setView('form');
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 space-y-8"
        >
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-200 mb-4">
              <Stethoscope className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
            <p className="text-slate-500">{t('login_google')}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input 
                required
                type="email" 
                placeholder="your@email.com"
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              {t('login_google')}
            </button>
          </form>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => {
                const newUser: User = { email: 'staff@demo.com', role: 'staff' };
                setUser(newUser);
                localStorage.setItem('user', JSON.stringify(newUser));
                setView('dashboard');
              }}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <LayoutDashboard size={14} />
              {t('demo_login')}
            </button>
            <button 
              onClick={() => {
                const newUser: User = { email: 'patient@demo.com', role: 'patient' };
                setUser(newUser);
                localStorage.setItem('user', JSON.stringify(newUser));
                setView('form');
              }}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <UserIcon size={14} />
              {t('patient_demo')}
            </button>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors text-sm font-medium"
            >
              <Globe size={16} />
              {i18n.language === 'vi' ? 'English' : 'Tiếng Việt'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* iOS Install Prompt */}
      <AnimatePresence>
        {showInstallPrompt && (
          <motion.div 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 z-[100] p-4 pt-safe"
          >
            <div className="bg-indigo-600 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <PlusCircle size={20} />
                </div>
                <div className="text-xs">
                  <p className="font-bold">Cài đặt ứng dụng</p>
                  <p className="opacity-80">Nhấn <span className="font-bold">Chia sẻ</span> và chọn <span className="font-bold">Thêm vào MH chính</span></p>
                </div>
              </div>
              <button onClick={() => setShowInstallPrompt(false)} className="p-1 hover:bg-white/10 rounded-lg">
                <XCircle size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with Safe Area */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 pt-safe">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg">
            <Stethoscope size={24} />
            <span className="hidden sm:inline">Medical App</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={toggleLanguage}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              title="Switch Language"
            >
              <Globe size={20} />
            </button>
            
            <div className="h-8 w-px bg-slate-200 mx-1" />
            
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-xs font-bold text-slate-900">{user.email}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">{user.role}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title={t('logout')}
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Flex Grow to push nav down */}
      <main className="flex-grow max-w-6xl mx-auto px-4 py-8 w-full mb-20">
        <AnimatePresence mode="wait">
          {view === 'form' && (
            <motion.div
              key={editingSubmission ? `edit-${editingSubmission.id}` : 'new-form'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <MedicalForm 
                userEmail={user.email} 
                initialData={editingSubmission?.data}
                submissionId={editingSubmission?.id}
                readOnly={isReadOnly}
                onSuccess={handleFormSuccess} 
              />
            </motion.div>
          )}
          {view === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Dashboard 
                userEmail={user.email} 
                onEdit={handleEdit}
                onView={handleView}
              />
            </motion.div>
          )}
          {view === 'dashboard' && user.role === 'staff' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Dashboard 
                userEmail={user.email} 
                onView={handleView}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation (Mobile Friendly with Safe Area) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 pb-safe h-[calc(4rem+var(--sab))] flex items-start justify-around z-50">
        <div className="flex w-full h-16 items-center justify-around">
          <button 
            onClick={() => {
              setEditingSubmission(null);
              setView('form');
            }}
            className={`flex flex-col items-center gap-1 transition-colors ${view === 'form' ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <PlusCircle size={20} />
            <span className="text-[10px] font-bold uppercase">{t('submit')}</span>
          </button>

          <button 
            onClick={() => setView('history')}
            className={`flex flex-col items-center gap-1 transition-colors ${view === 'history' ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <HistoryIcon size={20} />
            <span className="text-[10px] font-bold uppercase">{t('my_submissions')}</span>
          </button>
          
          {user.role === 'staff' && (
            <button 
              onClick={() => setView('dashboard')}
              className={`flex flex-col items-center gap-1 transition-colors ${view === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`}
            >
              <LayoutDashboard size={20} />
              <span className="text-[10px] font-bold uppercase">Dashboard</span>
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}

