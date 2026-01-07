
import React, { useState, useEffect } from 'react';
import { Client, CandidateType, University } from '../types';
import { EU_COUNTRIES } from '../constants';

interface IntakeFormProps {
  universities: University[];
  onAddClient: (client: Client) => void;
}

const IntakeForm: React.FC<IntakeFormProps> = ({ universities, onAddClient }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    passportCountry: 'United Kingdom',
    residenceCountry: 'United Kingdom',
    preferredUniversities: [] as string[],
  });

  const [candidateType, setCandidateType] = useState<CandidateType>(CandidateType.NON_EU);

  useEffect(() => {
    const isEUPassport = EU_COUNTRIES.includes(formData.passportCountry);
    const isEUResident = EU_COUNTRIES.includes(formData.residenceCountry);
    
    if (isEUPassport || isEUResident) {
      setCandidateType(CandidateType.EU);
    } else {
      setCandidateType(CandidateType.NON_EU);
    }
  }, [formData.passportCountry, formData.residenceCountry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient: Client = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      candidateType,
      completedRequirementIds: [],
      files: [],
      createdAt: new Date().toISOString(),
    };
    onAddClient(newClient);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      passportCountry: 'United Kingdom',
      residenceCountry: 'United Kingdom',
      preferredUniversities: [],
    });
    alert('Client onboarded successfully!');
  };

  const handleUniversityToggle = (uniId: string) => {
    setFormData(prev => ({
      ...prev,
      preferredUniversities: prev.preferredUniversities.includes(uniId)
        ? prev.preferredUniversities.filter(id => id !== uniId)
        : [...prev.preferredUniversities, uniId]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 p-6 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800">New Candidate Intake</h2>
        <p className="text-slate-500">Collect candidate information and classify workflow.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">First Name</label>
            <input
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Last Name</label>
            <input
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Email Address</label>
            <input
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Phone Number</label>
            <input
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Physical Address</label>
          <textarea
            required
            rows={2}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Passport Issuing Country</label>
            <select
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.passportCountry}
              onChange={(e) => setFormData({...formData, passportCountry: e.target.value})}
            >
              {['United Kingdom', 'United States', 'Canada', 'Australia', 'China', 'India', ...EU_COUNTRIES].sort().map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Country of Residence</label>
            <select
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.residenceCountry}
              onChange={(e) => setFormData({...formData, residenceCountry: e.target.value})}
            >
               {['United Kingdom', 'United States', 'Canada', 'Australia', 'China', 'India', ...EU_COUNTRIES].sort().map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={`p-4 rounded-xl border-2 flex items-center justify-between ${candidateType === CandidateType.EU ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Auto-Detected Stream</span>
            <div className="text-xl font-bold flex items-center space-x-2">
              <i className={`fas ${candidateType === CandidateType.EU ? 'fa-euro-sign text-green-600' : 'fa-globe text-orange-600'}`}></i>
              <span className={candidateType === CandidateType.EU ? 'text-green-800' : 'text-orange-800'}>
                {candidateType === CandidateType.EU ? 'EU Candidate' : 'Non-EU Candidate'}
              </span>
            </div>
          </div>
          <div className="text-sm text-slate-600 max-w-xs text-right italic">
            {candidateType === CandidateType.EU 
              ? "EU passport or residence detected. Standard Italian residency rules apply."
              : "Outside EU/EEA/Switzerland. Visa and pre-enrollment steps required."}
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700">Preferred Universities</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {universities.map(uni => (
              <label key={uni.id} className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${formData.preferredUniversities.includes(uni.id) ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.preferredUniversities.includes(uni.id)}
                  onChange={() => handleUniversityToggle(uni.id)}
                />
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.preferredUniversities.includes(uni.id) ? 'bg-blue-500 border-blue-500' : 'bg-white border-slate-300'}`}>
                  {formData.preferredUniversities.includes(uni.id) && <i className="fas fa-check text-white text-xs"></i>}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-800">{uni.name}</span>
                  <span className="text-xs text-slate-500">{uni.city}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center space-x-2"
          >
            <i className="fas fa-user-check"></i>
            <span>Register Candidate</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default IntakeForm;
