import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  User as UserIcon, 
  Phone, 
  MapPin, 
  Stethoscope, 
  History as HistoryIcon, 
  Activity, 
  Thermometer, 
  Droplets, 
  Utensils, 
  Send,
  LogOut,
  ChevronRight,
  PlusCircle,
  LayoutDashboard,
  Globe,
  Calendar,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Submission, FormData } from '../types';

interface FormProps {
  userEmail: string;
  onSuccess: () => void;
  initialData?: Partial<FormData>;
  submissionId?: number;
  readOnly?: boolean;
}

export const MedicalForm: React.FC<FormProps> = ({ userEmail, onSuccess, initialData, submissionId, readOnly }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const [formData, setFormData] = useState<Partial<FormData>>(initialData || {
    gender: 'male',
    weight: '',
    occupation: '',
    address: '',
    phone: '',
    symptoms: '',
    onset: '',
    history: '',
    cold_heat: [],
    sweat: [],
    pain: [],
    pain_location: '',
    eating: [],
    taste: [],
    thirst: [],
    mouth_feeling: [],
    sleep: [],
    excretion: [],
    effort_emotion: [],
    head_throat: [],
    chest_limbs: [],
    women_health: [],
    tongue_body: [],
    tongue_quality: [],
    tongue_coating: [],
    disease_pattern: [],
    disease_pattern_custom: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo(0, 0);
      return;
    }

    if (readOnly) {
      onSuccess(); // Just close it
      return;
    }

    setLoading(true);
    try {
      const url = submissionId ? `/api/submissions/${submissionId}` : '/api/submissions';
      const method = submissionId ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'x-user-email': userEmail
        },
        body: JSON.stringify({
          email: userEmail,
          phone: formData.phone,
          data: formData
        })
      });
      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckbox = (field: keyof FormData, value: string) => {
    if (readOnly) return;
    const current = (formData[field] as string[]) || [];
    if (current.includes(value)) {
      setFormData({ ...formData, [field]: current.filter(v => v !== value) });
    } else {
      setFormData({ ...formData, [field]: [...current, value] });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-indigo-600 border-b border-indigo-100 pb-2">
                <UserIcon size={20} />
                <h2 className="font-bold uppercase tracking-wider">{t('basic_info')}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">{t('name')}</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name || ''}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">{t('gender')}</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="gender" 
                        checked={formData.gender === 'male'}
                        onChange={() => setFormData({ ...formData, gender: 'male' })}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <span>{t('male')}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="gender"
                        checked={formData.gender === 'female'}
                        onChange={() => setFormData({ ...formData, gender: 'female' })}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <span>{t('female')}</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">{t('age')}</label>
                  <input 
                    required
                    type="number" 
                    value={formData.age || ''}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    onChange={e => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">{t('phone')}</label>
                  <input 
                    required
                    type="tel" 
                    value={formData.phone || ''}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">{t('height')} (cm)</label>
                  <input 
                    type="text" 
                    value={formData.height || ''}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    onChange={e => setFormData({ ...formData, height: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">{t('weight')} (kg)</label>
                  <input 
                    type="text" 
                    value={formData.weight || ''}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    onChange={e => setFormData({ ...formData, weight: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">{t('occupation')}</label>
                  <input 
                    type="text" 
                    value={formData.occupation || ''}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-slate-700">{t('address')}</label>
                  <input 
                    type="text" 
                    value={formData.address || ''}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>
            </section>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-600 border-b border-indigo-100 pb-2">
                <Stethoscope size={20} />
                <h2 className="font-bold uppercase tracking-wider">{t('symptoms_title')}</h2>
              </div>
              <textarea 
                required
                value={formData.symptoms || ''}
                className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                placeholder="Ví dụ: Đau mỏi vai gáy, tay chân lạnh..."
                onChange={e => setFormData({ ...formData, symptoms: e.target.value })}
              />
            </section>
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-600 border-b border-indigo-100 pb-2">
                <Calendar size={20} />
                <h2 className="font-bold uppercase tracking-wider">{t('onset_title')}</h2>
              </div>
              <textarea 
                required
                value={formData.onset || ''}
                className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                placeholder="Ví dụ: Bị cảm cúm hơn một tháng..."
                onChange={e => setFormData({ ...formData, onset: e.target.value })}
              />
            </section>
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-600 border-b border-indigo-100 pb-2">
                <HistoryIcon size={20} />
                <h2 className="font-bold uppercase tracking-wider">{t('history_title')}</h2>
              </div>
              <textarea 
                required
                value={formData.history || ''}
                className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                placeholder="Ví dụ: Trước đây không có bệnh tật gì..."
                onChange={e => setFormData({ ...formData, history: e.target.value })}
              />
            </section>
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-2 text-indigo-600 border-b border-indigo-100 pb-2">
              <Activity size={20} />
              <h2 className="font-bold uppercase tracking-wider">{t('detailed_questions')} (1/3)</h2>
            </div>
            {/* Cold / Heat (A) */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-slate-800">
                <Thermometer size={18} />
                <h3 className="font-semibold">(A) {t('cold_heat')}</h3>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-500">1. Sợ lạnh:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Dù gần lửa, đắp thêm chăn áo cũng không hết lạnh.",
                    "Sợ lạnh: Gần lửa, đắp thêm chăn áo thì đỡ lạnh.",
                    "Mùa hè đặc biệt sợ lạnh.",
                    "Mùa đông đặc biệt sợ lạnh.",
                    "Mùa đông khi ngủ hai bàn chân không ấm (ngâm nước nóng trước khi ngủ mới ấm lên).",
                    "Mùa đông khi ngủ hai bàn chân lạnh suốt đêm (cần chăn dày hoặc máy sưởi)."
                  ].map(item => (
                    <label key={item} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input type="checkbox" checked={formData.cold_heat?.includes(item)} className="w-4 h-4 rounded text-indigo-600" onChange={() => handleCheckbox('cold_heat', item)} />
                      <span className="text-sm text-slate-600">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-500">2. Phát nhiệt (Sốt/Nóng trong người):</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Thân nhiệt tăng cao.",
                    "Thân nhiệt không cao nhưng tự cảm thấy nóng.",
                    "Cảm thấy nóng về chiều hoặc đêm.",
                    "Sốt nặng hơn về chiều.",
                    "Ngũ tâm phiền nhiệt (nóng lòng bàn tay, bàn chân và vùng ngực).",
                    "Mùa hè đặc biệt sợ nóng.",
                    "Mùa hè không sợ nóng.",
                    "Lúc nóng lúc lạnh (Hàn nhiệt vãng lai).",
                    "Sốt cao không hạ.",
                    "Sốt nhẹ kéo dài."
                  ].map(item => (
                    <label key={item} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input type="checkbox" checked={formData.cold_heat?.includes(item)} className="w-4 h-4 rounded text-indigo-600" onChange={() => handleCheckbox('cold_heat', item)} />
                      <span className="text-sm text-slate-600">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Sweat (B) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-800">
                <Droplets size={18} />
                <h3 className="font-semibold">(B) {t('sweat')}</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {["Dễ ra mồ hôi", "Không ra mồ hôi", "Mồ hôi trộm (khi ngủ)", "Mồ hôi ở đầu", "Mồ hôi tay chân"].map(item => (
                  <label key={item} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                    <input type="checkbox" checked={formData.sweat?.includes(item)} className="w-4 h-4 rounded text-indigo-600" onChange={() => handleCheckbox('sweat', item)} />
                    <span className="text-sm text-slate-600">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pain Status (C) */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-slate-800">
                <Activity size={18} />
                <h3 className="font-semibold">(C) {t('pain')}</h3>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-500">1. Vị trí đau:</p>
                <input 
                  type="text" 
                  value={formData.pain_location || ''}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Ví dụ: Đau vùng thắt lưng, đau khớp gối..."
                  onChange={e => setFormData({ ...formData, pain_location: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-500">2. Tính chất đau:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    "Đau quặn thắt, dữ dội", "Đau trướng căng tức", "Đau nhói", "Đau buốt, lạnh",
                    "Đau rát", "Đau mỏi, ê ẩm", "Đau nặng", "Đau không rõ ràng",
                    "Đau âm ỉ", "Đau co rút, giật", "Đau lan tỏa", "Đau cố định"
                  ].map(item => (
                    <label key={item} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input type="checkbox" checked={formData.pain?.includes(item)} className="w-4 h-4 rounded text-indigo-600" onChange={() => handleCheckbox('pain', item)} />
                      <span className="text-sm text-slate-600">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Eating (D) */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-slate-800">
                <Utensils size={18} />
                <h3 className="font-semibold">(D) TÌNH TRẠNG ĂN UỐNG, KHẨU VỊ</h3>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-500">1. Ăn uống:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Ăn uống bình thường.", "Ăn không ngon miệng.", "Ăn khá ngon.", "Ăn rất ngon.",
                    "Thích đồ ăn lỏng.", "Thích đồ ăn khô.", "Thích ăn ngọt.", "Thích ăn mặn.",
                    "Thích ăn chua.", "Thích ăn cay.", "Thích ăn đồ ấm/nóng.", "Thích ăn đồ lạnh/mát."
                  ].map(item => (
                    <label key={item} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input type="checkbox" checked={formData.eating?.includes(item)} className="w-4 h-4 rounded text-indigo-600" onChange={() => handleCheckbox('eating', item)} />
                      <span className="text-sm text-slate-600">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-500">2. Khẩu vị:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {["Miệng nhạt không vị.", "Miệng đắng.", "Miệng ngọt.", "Miệng mặn."].map(item => (
                    <label key={item} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input type="checkbox" checked={formData.taste?.includes(item)} className="w-4 h-4 rounded text-indigo-600" onChange={() => handleCheckbox('taste', item)} />
                      <span className="text-sm text-slate-600">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-500">3. Khát nước:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Miệng khát, uống nhiều nước.", "Khát nhưng không muốn uống.",
                    "Khát, uống nhiều mà không hết khát.", "Khát, uống nhiều lại càng khát hơn.",
                    "Khát, thích uống nước lạnh.", "Khát, thích uống nước nóng."
                  ].map(item => (
                    <label key={item} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input type="checkbox" checked={formData.thirst?.includes(item)} className="w-4 h-4 rounded text-indigo-600" onChange={() => handleCheckbox('thirst', item)} />
                      <span className="text-sm text-slate-600">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-500">4. Cảm giác trong miệng:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Miệng dính nhớt.", "Miệng khô.", "Thỉnh thoảng họng khô.",
                    "Họng khô rõ rệt.", "Khô họng lúc nửa đêm."
                  ].map(item => (
                    <label key={item} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input type="checkbox" checked={formData.mouth_feeling?.includes(item)} className="w-4 h-4 rounded text-indigo-600" onChange={() => handleCheckbox('mouth_feeling', item)} />
                      <span className="text-sm text-slate-600">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div 
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-2 text-indigo-600 border-b border-indigo-100 pb-2">
              <Activity size={20} />
              <h2 className="font-bold uppercase tracking-wider">{t('detailed_questions')} (2/3)</h2>
            </div>

            {/* Excretion (E) */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-slate-800">
                <Droplets size={18} />
                <h3 className="font-semibold">(E) TÌNH TRẠNG ĐẠI TIỆN, TIỂU TIỆN</h3>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-500">1. Đại tiện:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Đại tiện mỗi ngày 1 lần.", "Đại tiện mỗi ngày 2 lần.", "Đại tiện mỗi ngày trên 2 lần.",
                    "2 ngày đi 1 lần.", "3 ngày đi 1 lần.", "4-10 ngày đi 1 lần.", "Phân hơi khô.",
                    "Phân lỏng hoặc không tiêu hóa hết thức ăn.", "Phân lúc đầu khô sau lỏng.",
                    "Phân cứng, vón cục như phân dê.", "Phân mềm, thành khuôn.", "Đi đại tiện nhanh.",
                    "Đi đại tiện bình thường.", "Đi đại tiện khó khăn.",
                    "Đại tiện dính, không thoải mái, có cảm giác mót rặn.", "Hậu môn nóng rát khi đại tiện."
                  ].map(item => (
                    <label key={item} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input type="checkbox" checked={formData.excretion?.includes(item)} className="w-4 h-4 rounded text-indigo-600" onChange={() => handleCheckbox('excretion', item)} />
                      <span className="text-sm text-slate-600">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-500">2. Tiểu tiện:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Tiểu tiện trong, không màu.", "Tiểu tiện màu vàng.", "Tiểu tiện không thông suốt.",
                    "Uống nước xong rất nhanh buồn tiểu.", "Tiểu không hết, vừa đi xong lại muốn đi nữa.",
                    "Không tiểu đêm.", "Tiểu đêm 1 lần.", "Tiểu đêm 2 lần.", "Tiểu đêm trên 2 lần.",
                    "Tiểu buốt, rắt hoặc tiểu không hết."
                  ].map(item => (
                    <label key={item} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input type="checkbox" checked={formData.excretion?.includes(item)} className="w-4 h-4 rounded text-indigo-600" onChange={() => handleCheckbox('excretion', item)} />
                      <span className="text-sm text-slate-600">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Sleep (F) */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-slate-800">
                <Clock size={18} />
                <h3 className="font-semibold">(F) TÌNH TRẠNG GIẤC NGỦ</h3>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-500">1. Mất ngủ:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Khó vào giấc ngủ.", "Ngủ dễ tỉnh, tỉnh rồi khó ngủ lại.", "Tỉnh rồi có thể nhanh chóng ngủ lại.",
                    "Hay giật mình tỉnh giấc.", "Không mơ.", "Ít mơ (thỉnh thoảng mơ, tỉnh dậy không nhớ rõ).",
                    "Mơ nhiều.", "Gặp ác mộng (đôi khi giật mình tỉnh dậy)."
                  ].map(item => (
                    <label key={item} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input type="checkbox" checked={formData.sleep?.includes(item)} className="w-4 h-4 rounded text-indigo-600" onChange={() => handleCheckbox('sleep', item)} />
                      <span className="text-sm text-slate-600">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-500">2. Sau khi thức dậy buổi sáng:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {["Tinh thần sảng khoái.", "Sáng dậy vẫn thấy mệt, muốn nằm thêm."].map(item => (
                    <label key={item} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input type="checkbox" checked={formData.sleep?.includes(item)} className="w-4 h-4 rounded text-indigo-600" onChange={() => handleCheckbox('sleep', item)} />
                      <span className="text-sm text-slate-600">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-500">3. Buồn ngủ:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {["Mệt mỏi, dễ ngủ.", "Cảm giác lơ mơ, không tỉnh táo.", "Sau khi ăn mệt mỏi, dễ buồn ngủ."].map(item => (
                    <label key={item} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input type="checkbox" checked={formData.sleep?.includes(item)} className="w-4 h-4 rounded text-indigo-600" onChange={() => handleCheckbox('sleep', item)} />
                      <span className="text-sm text-slate-600">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Effort & Emotion (G) */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-slate-800">
                <UserIcon size={18} />
                <h3 className="font-semibold">(G) TÌNH TRẠNG LAO LỰC, TÌNH CHÍ</h3>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-500">1. Lao lực:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Cơ thể gầy gò.", "Cơ thể béo.", "Dễ mệt mỏi.", "Mệt mỏi, không có sức.",
                    "Lưng gối mỏi mềm.", "Vận động là thở dốc (lên lầu hoặc chạy bộ).",
                    "Bình thường không thích vận động.", "Thích ngồi hoặc nằm."
                  ].map(item => (
                    <label key={item} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input type="checkbox" checked={formData.effort_emotion?.includes(item)} className="w-4 h-4 rounded text-indigo-600" onChange={() => handleCheckbox('effort_emotion', item)} />
                      <span className="text-sm text-slate-600">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-500">2. Tình chí (Tâm lý, cảm xúc):</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Khả năng tự chủ tốt, gặp chuyện lý trí, bình tĩnh.",
                    "Khả năng tự chủ kém, gặp chuyện dễ kích động, nổi nóng.",
                    "Tính cách hướng ngoại, lạc quan, vui vẻ.",
                    "Tính cách hướng nội, u uất, đa sầu đa cảm.",
                    "Thích thở dài thì thấy dễ chịu hơn."
                  ].map(item => (
                    <label key={item} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input type="checkbox" checked={formData.effort_emotion?.includes(item)} className="w-4 h-4 rounded text-indigo-600" onChange={() => handleCheckbox('effort_emotion', item)} />
                      <span className="text-sm text-slate-600">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div 
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-2 text-indigo-600 border-b border-indigo-100 pb-2">
              <Activity size={20} />
              <h2 className="font-bold uppercase tracking-wider">{t('detailed_questions')} (3/3)</h2>
            </div>

            {/* Women Health (H) */}
            {formData.gender === 'female' && (
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2"><Activity size={18} /> (H) TÌNH TRẠNG KINH NGUYỆT, KHÍ HƯ</h3>
                <textarea 
                  value={formData.women_health?.join('\n') || ''}
                  className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                  placeholder="Ví dụ: Kinh không đều, sắc sẫm, vón cục. Khí hư màu trắng..."
                  onChange={e => setFormData({ ...formData, women_health: e.target.value.split('\n') })}
                />
              </div>
            )}

            {/* Tongue Diagnosis (I) */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-slate-800">
                <UserIcon size={18} />
                <h3 className="font-semibold">(I) TÌNH TRẠNG LƯỠI (THIỆT CHẨN)</h3>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-500">1. Thân lưỡi:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {["Thân lưỡi bình thường.", "Thân lưỡi nhỏ, mỏng.", "Thân lưỡi bệu, to hoặc có vết hằn răng hai bên."].map(item => (
                    <label key={item} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input type="checkbox" checked={formData.tongue_body?.includes(item)} className="w-4 h-4 rounded text-indigo-600" onChange={() => handleCheckbox('tongue_body', item)} />
                      <span className="text-sm text-slate-600">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-500">2. Chất lưỡi:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Chất lưỡi bình thường.", "Chất lưỡi nhợt.", "Chất lưỡi đỏ.", "Chất lưỡi xanh tím.",
                    "Chất lưỡi đỏ thẫm.", "Đầu lưỡi đỏ.", "Rìa lưỡi và đầu lưỡi đỏ."
                  ].map(item => (
                    <label key={item} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input type="checkbox" checked={formData.tongue_quality?.includes(item)} className="w-4 h-4 rounded text-indigo-600" onChange={() => handleCheckbox('tongue_quality', item)} />
                      <span className="text-sm text-slate-600">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-500">3. Rêu lưỡi:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Rêu lưỡi mỏng.", "Rêu lưỡi dày.", "Không có rêu lưỡi.", "Rêu lưỡi bong tróc.",
                    "Rêu lưỡi trắng.", "Rêu lưỡi vàng.", "Rêu lưỡi xám.", "Rêu lưỡi đen.",
                    "Rêu lưỡi ướt, trơn.", "Rêu lưỡi khô.", "Rêu lưỡi bẩn, dính."
                  ].map(item => (
                    <label key={item} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input type="checkbox" checked={formData.tongue_coating?.includes(item)} className="w-4 h-4 rounded text-indigo-600" onChange={() => handleCheckbox('tongue_coating', item)} />
                      <span className="text-sm text-slate-600">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Disease Pattern (J) */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-slate-800">
                <Calendar size={18} />
                <h3 className="font-semibold">(J) QUY LUẬT PHÁT BỆNH</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Bệnh tình không có quy luật.",
                  "Bệnh nặng hơn vào mùa đông.", "Bệnh nhẹ đi vào mùa đông.",
                  "Bệnh nặng hơn vào mùa hè.", "Bệnh nhẹ đi vào mùa hè.",
                  "Bệnh nặng hơn vào buổi chiều.", "Bệnh nặng hơn vào ban đêm.",
                  "Bệnh nặng hơn khi gặp nóng.", "Bệnh nặng hơn khi gặp lạnh.",
                  "Bệnh nặng hơn sau khi vận động.", "Bệnh nhẹ đi sau khi vận động.",
                  "Bệnh nặng hơn sau khi nghỉ ngơi.", "Bệnh nhẹ đi sau khi nghỉ ngơi.",
                  "Bệnh nặng hơn sau khi uống rượu.", "Bệnh nhẹ đi sau khi uống rượu.",
                  "Bệnh tình có liên quan rõ rệt đến cảm xúc."
                ].map(item => (
                  <label key={item} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                    <input type="checkbox" checked={formData.disease_pattern?.includes(item)} className="w-4 h-4 rounded text-indigo-600" onChange={() => handleCheckbox('disease_pattern', item)} />
                    <span className="text-sm text-slate-600">{item}</span>
                  </label>
                ))}
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-500">Quy luật khác (tự ghi rõ):</p>
                <textarea 
                  value={formData.disease_pattern_custom || ''}
                  className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[80px]"
                  placeholder="Ghi rõ quy luật khác nếu có..."
                  onChange={e => setFormData({ ...formData, disease_pattern_custom: e.target.value })}
                />
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {[1, 2, 3, 4, 5].map(s => (
            <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === s ? 'bg-indigo-600 text-white scale-110' : step > s ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
              {step > s ? '✓' : s}
            </div>
          ))}
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('step')} {step} / {totalSteps}</span>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl space-y-8 border border-slate-100">
        <fieldset disabled={readOnly} className="space-y-8">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </fieldset>

        <div className="pt-6 flex gap-4">
          {step > 1 && (
            <button 
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {t('previous')}
            </button>
          )}
          <button 
            disabled={loading}
            type="submit" 
            className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? t('loading') : (
              <>
                {step === totalSteps ? (
                  <>
                    <Send size={20} />
                    {readOnly ? t('close') : t('submit')}
                  </>
                ) : (
                  <>
                    {t('next')}
                    <ChevronRight size={20} />
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
