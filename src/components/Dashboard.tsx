import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  User, 
  Calendar, 
  Phone,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  XCircle,
  Save,
  BarChart3,
  Edit3,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Submission } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface DashboardProps {
  userEmail: string;
  onEdit?: (submission: Submission) => void;
  onView?: (submission: Submission) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ userEmail, onEdit, onView }) => {
  const { t } = useTranslation();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMetrics, setShowMetrics] = useState(false);
  const [editingNotes, setEditingNotes] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    fetchSubmissions();
    fetchStats();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/submissions', {
        headers: { 'x-user-email': userEmail }
      });
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats', {
        headers: { 'x-user-email': userEmail }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateSubmission = async (id: number, updates: Partial<Submission>) => {
    try {
      const response = await fetch(`/api/submissions/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-email': userEmail
        },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        fetchSubmissions();
        fetchStats();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredSubmissions = submissions.filter(s => 
    s.phone.includes(searchTerm) || 
    s.data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'Cancelled': return <XCircle size={16} className="text-rose-500" />;
      default: return <Clock size={16} className="text-amber-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Cancelled': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-amber-50 text-amber-700 border-amber-100';
    }
  };

  if (loading) return <div className="text-center py-20">{t('loading')}</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {submissions.length > 0 && submissions[0].email === userEmail && submissions.length < 100 && !userEmail.includes('staff') ? t('my_submissions') : t('staff_dashboard')}
          </h1>
          <p className="text-slate-500">{submissions.length} {t('my_submissions').toLowerCase()}</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search name, phone..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowMetrics(!showMetrics)}
            className={`p-2 rounded-xl transition-colors ${showMetrics ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
          >
            <BarChart3 size={20} />
          </button>
        </div>
      </div>

      {/* Metrics Section */}
      <AnimatePresence>
        {showMetrics && stats && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden"
          >
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <p className="text-sm font-medium text-slate-500">{t('total_submissions')}</p>
              <p className="text-4xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm md:col-span-2">
              <p className="text-sm font-medium text-slate-500 mb-4">{t('daily_trend')}</p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.daily}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      cursor={{ fill: '#f8fafc' }}
                    />
                    <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-200 text-slate-400">
            {t('no_submissions')}
          </div>
        ) : (
          filteredSubmissions.map(submission => (
            <motion.div 
              layout
              key={submission.id} 
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
              <div 
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedId(expandedId === submission.id ? null : submission.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                    {submission.data.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{submission.data.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Phone size={12} /> {submission.phone}</span>
                      <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(submission.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {onView && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(submission);
                      }}
                      className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors"
                      title={t('view_details')}
                    >
                      <Eye size={18} />
                    </button>
                  )}
                  {submission.email === userEmail && submission.status === 'Pending' && onEdit && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(submission);
                      }}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Sửa phiếu"
                    >
                      <Edit3 size={18} />
                    </button>
                  )}
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(submission.status)}`}>
                    {getStatusIcon(submission.status)}
                    {t(submission.status.toLowerCase())}
                  </div>
                  {expandedId === submission.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                </div>
              </div>

              <AnimatePresence>
                {expandedId === submission.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-50 p-6 bg-slate-50/50"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        {/* Basic Info */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{t('basic_info')}</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-white p-3 rounded-xl border border-slate-100">
                              <p className="text-slate-500 text-[10px] uppercase font-bold">{t('age')}</p>
                              <p className="font-medium">{submission.data.age}</p>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-slate-100">
                              <p className="text-slate-500 text-[10px] uppercase font-bold">{t('gender')}</p>
                              <p className="font-medium">{submission.data.gender === 'male' ? t('male') : t('female')}</p>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-slate-100">
                              <p className="text-slate-500 text-[10px] uppercase font-bold">{t('height')}</p>
                              <p className="font-medium">{submission.data.height}cm</p>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-slate-100">
                              <p className="text-slate-500 text-[10px] uppercase font-bold">{t('weight')}</p>
                              <p className="font-medium">{submission.data.weight}kg</p>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-slate-100 col-span-2">
                              <p className="text-slate-500 text-[10px] uppercase font-bold">{t('occupation')}</p>
                              <p className="font-medium">{submission.data.occupation}</p>
                            </div>
                          </div>
                        </div>

                        {/* Symptoms */}
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t('symptoms_title')}</h4>
                            <p className="text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-100">{submission.data.symptoms}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t('onset_title')}</h4>
                            <p className="text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-100">{submission.data.onset}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t('history_title')}</h4>
                            <p className="text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-100">{submission.data.history}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {/* Staff Management Section */}
                        {(userEmail.includes('staff') || userEmail === 'trthuong2711@gmail.com') && (
                          <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm space-y-4">
                            <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{t('staff_dashboard')}</h4>
                            
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">{t('status')}</label>
                              <div className="flex gap-2">
                                {['Pending', 'Completed', 'Cancelled'].map(s => (
                                  <button 
                                    key={s}
                                    onClick={() => updateSubmission(submission.id, { status: s as any })}
                                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all border ${submission.status === s ? getStatusColor(s) : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100'}`}
                                  >
                                    {t(s.toLowerCase())}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">{t('staff_notes')}</label>
                              <textarea 
                                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm min-h-[80px]"
                                value={editingNotes[submission.id] !== undefined ? editingNotes[submission.id] : (submission.staff_notes || '')}
                                onChange={e => setEditingNotes({ ...editingNotes, [submission.id]: e.target.value })}
                              />
                              <button 
                                onClick={() => updateSubmission(submission.id, { staff_notes: editingNotes[submission.id] })}
                                className="w-full bg-indigo-600 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-indigo-700"
                              >
                                <Save size={14} />
                                {t('save')}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Patient View of Notes */}
                        {!userEmail.includes('staff') && userEmail !== 'trthuong2711@gmail.com' && submission.staff_notes && (
                          <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 space-y-2">
                            <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{t('staff_notes')}</h4>
                            <p className="text-sm text-indigo-900 italic">"{submission.staff_notes}"</p>
                          </div>
                        )}

                        {/* Physiological Data */}
                        <div className="space-y-6">
                          {/* A. Cold/Heat */}
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t('cold_heat')}</h4>
                            <div className="flex flex-wrap gap-2">
                              {submission.data.cold_heat?.map(v => <span key={v} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px]">{v}</span>)}
                            </div>
                          </div>

                          {/* B. Sweat */}
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t('sweat')}</h4>
                            <div className="flex flex-wrap gap-2">
                              {submission.data.sweat?.map(v => <span key={v} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px]">{v}</span>)}
                            </div>
                          </div>

                          {/* C. Pain */}
                          {submission.data.pain && submission.data.pain.length > 0 && (
                            <div>
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t('pain')}</h4>
                              {submission.data.pain_location && (
                                <p className="text-xs text-slate-600 mb-2 italic">Vị trí: {submission.data.pain_location}</p>
                              )}
                              <div className="flex flex-wrap gap-2">
                                {submission.data.pain.map(v => <span key={v} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px]">{v}</span>)}
                              </div>
                            </div>
                          )}

                          {/* D. Eating & Taste */}
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t('eating')}</h4>
                            <div className="space-y-3">
                              {submission.data.eating?.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {submission.data.eating.map(v => <span key={v} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px]">{v}</span>)}
                                </div>
                              )}
                              {submission.data.taste?.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Khẩu vị:</span>
                                  {submission.data.taste.map(v => <span key={v} className="px-2 py-1 bg-indigo-50 border border-indigo-100 rounded text-[10px]">{v}</span>)}
                                </div>
                              )}
                              {submission.data.thirst?.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Khát nước:</span>
                                  {submission.data.thirst.map(v => <span key={v} className="px-2 py-1 bg-indigo-50 border border-indigo-100 rounded text-[10px]">{v}</span>)}
                                </div>
                              )}
                              {submission.data.mouth_feeling?.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Cảm giác miệng:</span>
                                  {submission.data.mouth_feeling.map(v => <span key={v} className="px-2 py-1 bg-indigo-50 border border-indigo-100 rounded text-[10px]">{v}</span>)}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* E. Excretion */}
                          {submission.data.excretion && submission.data.excretion.length > 0 && (
                            <div>
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t('excretion')}</h4>
                              <div className="flex flex-wrap gap-2">
                                {submission.data.excretion.map(v => <span key={v} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px]">{v}</span>)}
                              </div>
                            </div>
                          )}

                          {/* F. Sleep */}
                          {submission.data.sleep && submission.data.sleep.length > 0 && (
                            <div>
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t('sleep')}</h4>
                              <div className="flex flex-wrap gap-2">
                                {submission.data.sleep.map(v => <span key={v} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px]">{v}</span>)}
                              </div>
                            </div>
                          )}

                          {/* G. Effort & Emotion */}
                          {submission.data.effort_emotion && submission.data.effort_emotion.length > 0 && (
                            <div>
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t('effort_emotion')}</h4>
                              <div className="flex flex-wrap gap-2">
                                {submission.data.effort_emotion.map(v => <span key={v} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px]">{v}</span>)}
                              </div>
                            </div>
                          )}

                          {/* H. Women Health */}
                          {submission.data.women_health && submission.data.women_health.length > 0 && (
                            <div>
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t('women_health')}</h4>
                              <div className="bg-white p-3 rounded-lg border border-slate-100 text-sm italic text-slate-600">
                                {submission.data.women_health.join(', ')}
                              </div>
                            </div>
                          )}

                          {/* I. Tongue Diagnosis */}
                          {(submission.data.tongue_body?.length > 0 || submission.data.tongue_quality?.length > 0 || submission.data.tongue_coating?.length > 0) && (
                            <div>
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t('tongue')}</h4>
                              <div className="space-y-2">
                                {submission.data.tongue_body?.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Thân:</span>
                                    {submission.data.tongue_body.map(v => <span key={v} className="px-2 py-1 bg-rose-50 border border-rose-100 rounded text-[10px]">{v}</span>)}
                                  </div>
                                )}
                                {submission.data.tongue_quality?.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Chất:</span>
                                    {submission.data.tongue_quality.map(v => <span key={v} className="px-2 py-1 bg-rose-50 border border-rose-100 rounded text-[10px]">{v}</span>)}
                                  </div>
                                )}
                                {submission.data.tongue_coating?.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Rêu:</span>
                                    {submission.data.tongue_coating.map(v => <span key={v} className="px-2 py-1 bg-rose-50 border border-rose-100 rounded text-[10px]">{v}</span>)}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* J. Disease Pattern */}
                          {submission.data.disease_pattern && (submission.data.disease_pattern.length > 0 || submission.data.disease_pattern_custom) && (
                            <div>
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t('disease_pattern')}</h4>
                              <div className="space-y-2">
                                {submission.data.disease_pattern.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {submission.data.disease_pattern.map(v => <span key={v} className="px-2 py-1 bg-amber-50 border border-amber-100 rounded text-[10px]">{v}</span>)}
                                  </div>
                                )}
                                {submission.data.disease_pattern_custom && (
                                  <p className="text-xs text-slate-600 italic bg-white p-2 rounded border border-slate-100">
                                    Quy luật khác: {submission.data.disease_pattern_custom}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

