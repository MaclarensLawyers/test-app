
import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import IntakeForm from './components/IntakeForm';
import ClientTracker from './components/ClientTracker';
import { 
  AppView, Client, University, Deadline, Requirement, Stage, 
  CandidateType, ReminderFrequency 
} from './types';
import { INITIAL_UNIVERSITIES, INITIAL_STAGES } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('DASHBOARD');
  const [clients, setClients] = useState<Client[]>([]);
  const [universities, setUniversities] = useState<University[]>(INITIAL_UNIVERSITIES);
  const [stages, setStages] = useState<Stage[]>(INITIAL_STAGES);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Modal states for adding items
  const [showModal, setShowModal] = useState<AppView | null>(null);

  // New Item states
  const [newDeadline, setNewDeadline] = useState<Partial<Deadline>>({
    appliesTo: CandidateType.BOTH,
    reminderFrequency: ReminderFrequency.WEEKLY,
  });
  const [newRequirement, setNewRequirement] = useState<Partial<Requirement>>({
    appliesTo: CandidateType.BOTH,
    reminderFrequency: ReminderFrequency.WEEKLY,
    stageId: INITIAL_STAGES[0].id,
  });
  const [newUni, setNewUni] = useState<Partial<University>>({});
  const [newStage, setNewStage] = useState<Partial<Stage>>({ order: INITIAL_STAGES.length + 1 });

  const handleAddClient = (client: Client) => {
    setClients(prev => [client, ...prev]);
    setCurrentView('CLIENTS');
    setSelectedClientId(client.id);
  };

  const handleToggleRequirement = (clientId: string, requirementId: string) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        const isCompleted = c.completedRequirementIds.includes(requirementId);
        return {
          ...c,
          completedRequirementIds: isCompleted 
            ? c.completedRequirementIds.filter(id => id !== requirementId)
            : [...c.completedRequirementIds, requirementId]
        };
      }
      return c;
    }));
  };

  const addDeadline = () => {
    if (!newDeadline.name || !newDeadline.date) return;
    const deadline: Deadline = {
      id: Math.random().toString(36).substr(2, 9),
      name: newDeadline.name!,
      date: newDeadline.date!,
      appliesTo: newDeadline.appliesTo as CandidateType,
      reminderFrequency: newDeadline.reminderFrequency as ReminderFrequency,
      universityId: newDeadline.universityId,
      clientId: newDeadline.clientId,
      description: newDeadline.description,
    };
    setDeadlines(prev => [...prev, deadline]);
    setShowModal(null);
    setNewDeadline({ appliesTo: CandidateType.BOTH, reminderFrequency: ReminderFrequency.WEEKLY });
  };

  const addRequirement = () => {
    if (!newRequirement.name || !newRequirement.stageId) return;
    const req: Requirement = {
      id: Math.random().toString(36).substr(2, 9),
      name: newRequirement.name!,
      appliesTo: newRequirement.appliesTo as CandidateType,
      reminderFrequency: newRequirement.reminderFrequency as ReminderFrequency,
      stageId: newRequirement.stageId!,
      dueBy: newRequirement.dueBy,
      description: newRequirement.description,
      universityId: newRequirement.universityId,
    };
    setRequirements(prev => [...prev, req]);
    setShowModal(null);
    setNewRequirement({ appliesTo: CandidateType.BOTH, reminderFrequency: ReminderFrequency.WEEKLY, stageId: stages[0]?.id });
  };

  const addUniversity = () => {
    if (!newUni.name) return;
    const uni: University = {
      id: Math.random().toString(36).substr(2, 9),
      name: newUni.name!,
      city: newUni.city || '',
      website: newUni.website || '',
      description: newUni.description || '',
    };
    setUniversities(prev => [...prev, uni]);
    setShowModal(null);
    setNewUni({});
  };

  const addStage = () => {
    if (!newStage.name) return;
    const stage: Stage = {
      id: Math.random().toString(36).substr(2, 9),
      name: newStage.name!,
      order: newStage.order || stages.length + 1,
    };
    setStages(prev => [...prev, stage].sort((a,b) => a.order - b.order));
    setShowModal(null);
    setNewStage({ order: stages.length + 2 });
  };

  const deleteStage = (id: string) => {
    if (confirm('Are you sure? All requirements in this stage will lose their association.')) {
      setStages(prev => prev.filter(s => s.id !== id));
    }
  };

  const selectedClient = clients.find(c => c.id === selectedClientId);

  return (
    <div className="min-h-screen bg-slate-50 pl-64 transition-all duration-300">
      <Sidebar currentView={currentView} setView={(v) => { setCurrentView(v); if(v !== 'CLIENTS') setSelectedClientId(null); }} />

      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-40">
        <h2 className="text-2xl font-black text-slate-800 flex items-center space-x-3">
          {currentView === 'DASHBOARD' && <><i className="fas fa-chart-line text-blue-600"></i><span>Executive Dashboard</span></>}
          {currentView === 'CLIENTS' && <><i className="fas fa-users text-blue-600"></i><span>Client Portfolio</span></>}
          {currentView === 'INTAKE' && <><i className="fas fa-user-plus text-blue-600"></i><span>New Intake Session</span></>}
          {currentView === 'UNIVERSITIES' && <><i className="fas fa-university text-blue-600"></i><span>University Directory</span></>}
          {currentView === 'DEADLINES' && <><i className="fas fa-calendar-alt text-blue-600"></i><span>Deadline Monitor</span></>}
          {currentView === 'REQUIREMENTS' && <><i className="fas fa-clipboard-list text-blue-600"></i><span>Requirement Catalog</span></>}
          {currentView === 'STAGES' && <><i className="fas fa-layer-group text-blue-600"></i><span>Workflow Management</span></>}
        </h2>
        
        <div className="flex items-center space-x-6">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold text-slate-800">Admin User</div>
            <div className="text-xs text-slate-400 font-medium">Head of Admissions</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-slate-100 cursor-pointer">
            <img src="https://picsum.photos/40/40?grayscale" alt="avatar" />
          </div>
        </div>
      </header>

      <main className="p-10 pb-20">
        {currentView === 'DASHBOARD' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Clients', value: clients.length, icon: 'fa-users', color: 'bg-blue-600' },
                { label: 'EU Stream', value: clients.filter(c => c.candidateType === CandidateType.EU).length, icon: 'fa-euro-sign', color: 'bg-green-600' },
                { label: 'Non-EU Stream', value: clients.filter(c => c.candidateType === CandidateType.NON_EU).length, icon: 'fa-globe', color: 'bg-orange-600' },
                { label: 'Active Deadlines', value: deadlines.length, icon: 'fa-calendar-check', color: 'bg-purple-600' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white text-xl shadow-lg`}>
                    <i className={`fas ${stat.icon}`}></i>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                    <div className="text-2xl font-black text-slate-800">{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-between">
                    <span>Upcoming Deadlines</span>
                    <button onClick={() => setShowModal('DEADLINES')} className="text-sm text-blue-600 font-bold hover:underline">+ New</button>
                  </h3>
                  {deadlines.length === 0 ? (
                    <div className="py-12 text-center text-slate-400">
                      <i className="fas fa-calendar-times text-4xl mb-4 opacity-20"></i>
                      <p>No deadlines recorded yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {deadlines.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5).map(dl => (
                        <div key={dl.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex flex-col items-center justify-center text-xs font-bold shadow-sm">
                              <span className="text-blue-600">{new Date(dl.date).toLocaleString('default', { month: 'short' })}</span>
                              <span className="text-slate-800">{new Date(dl.date).getDate()}</span>
                            </div>
                            <div>
                              <div className="font-bold text-slate-800">{dl.name}</div>
                              <div className="text-xs text-slate-500 flex items-center">
                                <span className={`mr-2 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-tighter text-white ${dl.appliesTo === CandidateType.EU ? 'bg-green-500' : dl.appliesTo === CandidateType.NON_EU ? 'bg-orange-500' : 'bg-slate-500'}`}>
                                  {dl.appliesTo}
                                </span>
                                {dl.universityId && <span className="flex items-center"><i className="fas fa-university mr-1"></i> {universities.find(u => u.id === dl.universityId)?.name}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-black text-slate-400">REMINDER</div>
                            <div className="text-[10px] font-bold text-blue-600">{dl.reminderFrequency}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
               </div>

               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-between">
                    <span>Recent Clients</span>
                    <button onClick={() => setCurrentView('INTAKE')} className="text-sm text-blue-600 font-bold hover:underline">Intake</button>
                  </h3>
                  {clients.length === 0 ? (
                    <p className="py-12 text-center text-slate-400">No clients onboarded yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {clients.slice(0, 6).map(c => (
                        <button 
                          key={c.id} 
                          onClick={() => { setSelectedClientId(c.id); setCurrentView('CLIENTS'); }}
                          className="w-full flex items-center space-x-3 p-3 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all text-left"
                        >
                          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-sm">
                            {c.firstName[0]}{c.lastName[0]}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <div className="font-bold text-slate-800 truncate">{c.firstName} {c.lastName}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.candidateType} Stream</div>
                          </div>
                          <i className="fas fa-chevron-right text-slate-300 text-xs"></i>
                        </button>
                      ))}
                    </div>
                  )}
               </div>
            </div>
          </div>
        )}

        {currentView === 'CLIENTS' && (
          <div className="space-y-10">
            {!selectedClientId ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map(c => (
                  <div key={c.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer group" onClick={() => setSelectedClientId(c.id)}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-xl font-bold">
                        {c.firstName[0]}{c.lastName[0]}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${c.candidateType === CandidateType.EU ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {c.candidateType}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{c.firstName} {c.lastName}</h3>
                    <p className="text-slate-500 text-sm mb-4 truncate">{c.email}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="text-xs font-bold text-slate-400">
                        {c.completedRequirementIds.length} / {requirements.length} REQS
                      </div>
                      <div className="text-blue-600 font-black text-sm">
                        View Progress <i className="fas fa-arrow-right ml-1"></i>
                      </div>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => setCurrentView('INTAKE')}
                  className="bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 p-6 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 hover:border-slate-400 transition-all"
                >
                  <i className="fas fa-user-plus text-3xl mb-2"></i>
                  <span className="font-bold">New Candidate Intake</span>
                </button>
              </div>
            ) : (
              <div>
                <button 
                  onClick={() => setSelectedClientId(null)}
                  className="mb-8 text-slate-500 hover:text-slate-800 font-bold flex items-center space-x-2 transition-colors"
                >
                  <i className="fas fa-arrow-left"></i>
                  <span>Back to Portfolio</span>
                </button>
                <ClientTracker 
                  client={selectedClient!} 
                  stages={stages} 
                  requirements={requirements}
                  onToggleRequirement={handleToggleRequirement}
                />
              </div>
            )}
          </div>
        )}

        {currentView === 'INTAKE' && (
          <IntakeForm universities={universities} onAddClient={handleAddClient} />
        )}

        {currentView === 'UNIVERSITIES' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button onClick={() => setShowModal('UNIVERSITIES')} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center space-x-2">
                <i className="fas fa-plus"></i>
                <span>Add University</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {universities.map(uni => (
                <div key={uni.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                      <i className="fas fa-university text-2xl"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 leading-tight">{uni.name}</h3>
                      <p className="text-sm text-slate-500">{uni.city}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-6 line-clamp-3">{uni.description}</p>
                  <a href={uni.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 font-bold text-xs uppercase tracking-widest hover:underline">
                    Visit Website <i className="fas fa-external-link-alt ml-2"></i>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'DEADLINES' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button onClick={() => setShowModal('DEADLINES')} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center space-x-2">
                <i className="fas fa-calendar-plus"></i>
                <span>Record Deadline</span>
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                    <tr>
                      <th className="px-8 py-4">Deadline Name</th>
                      <th className="px-8 py-4">Target Date</th>
                      <th className="px-8 py-4">Applies To</th>
                      <th className="px-8 py-4">University / Client</th>
                      <th className="px-8 py-4">Reminders</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {deadlines.length === 0 ? (
                      <tr><td colSpan={5} className="p-10 text-center text-slate-400 italic">No deadlines created.</td></tr>
                    ) : (
                      deadlines.map(dl => (
                        <tr key={dl.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-8 py-4 font-bold text-slate-800">{dl.name}</td>
                          <td className="px-8 py-4">
                            <span className="font-medium text-slate-700">{new Date(dl.date).toLocaleDateString()}</span>
                          </td>
                          <td className="px-8 py-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter text-white ${dl.appliesTo === CandidateType.EU ? 'bg-green-500' : dl.appliesTo === CandidateType.NON_EU ? 'bg-orange-500' : 'bg-slate-500'}`}>
                              {dl.appliesTo}
                            </span>
                          </td>
                          <td className="px-8 py-4">
                            {dl.universityId ? (
                              <div className="text-xs text-slate-600 flex items-center"><i className="fas fa-university mr-1.5 opacity-40"></i> {universities.find(u => u.id === dl.universityId)?.name}</div>
                            ) : dl.clientId ? (
                              <div className="text-xs text-slate-600 flex items-center"><i className="fas fa-user mr-1.5 opacity-40"></i> {clients.find(c => c.id === dl.clientId)?.firstName} {clients.find(c => c.id === dl.clientId)?.lastName}</div>
                            ) : (
                              <span className="text-xs text-slate-400">All Admissions</span>
                            )}
                          </td>
                          <td className="px-8 py-4">
                             <span className="text-blue-600 font-bold">{dl.reminderFrequency}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {currentView === 'REQUIREMENTS' && (
           <div className="space-y-6">
            <div className="flex justify-end">
              <button onClick={() => setShowModal('REQUIREMENTS')} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center space-x-2">
                <i className="fas fa-clipboard-check"></i>
                <span>Add Requirement</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requirements.map(req => (
                <div key={req.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest">{stages.find(s => s.id === req.stageId)?.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase text-white ${req.appliesTo === CandidateType.EU ? 'bg-green-500' : req.appliesTo === CandidateType.NON_EU ? 'bg-orange-500' : 'bg-slate-500'}`}>
                      {req.appliesTo}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg mb-2">{req.name}</h3>
                  <p className="text-xs text-slate-500 mb-4 h-12 line-clamp-3">{req.description || 'No description provided.'}</p>
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-400">
                    <div className="flex items-center">
                       <i className="fas fa-bell mr-1.5"></i> {req.reminderFrequency}
                    </div>
                    {req.dueBy && <span>DUE: {new Date(req.dueBy).toLocaleDateString()}</span>}
                  </div>
                </div>
              ))}
              {requirements.length === 0 && (
                <div className="col-span-full py-20 text-center bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300">
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No global requirements defined yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {currentView === 'STAGES' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button onClick={() => setShowModal('STAGES')} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center space-x-2">
                <i className="fas fa-layer-group"></i>
                <span>Create Workflow Stage</span>
              </button>
            </div>
            <div className="space-y-4">
              {stages.map(stage => (
                <div key={stage.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center justify-between">
                   <div className="flex items-center space-x-6">
                      <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black">{stage.order}</div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">{stage.name}</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                          {requirements.filter(r => r.stageId === stage.id).length} Associated Requirements
                        </p>
                      </div>
                   </div>
                   <div className="flex items-center space-x-3">
                      <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><i className="fas fa-edit"></i></button>
                      <button onClick={() => deleteStage(stage.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><i className="fas fa-trash-alt"></i></button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODALS */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                Add New {showModal === 'DEADLINES' ? 'Deadline' : showModal === 'REQUIREMENTS' ? 'Requirement' : showModal === 'UNIVERSITIES' ? 'University' : 'Stage'}
              </h3>
              <button onClick={() => setShowModal(null)} className="text-slate-400 hover:text-slate-800"><i className="fas fa-times text-xl"></i></button>
            </div>

            <div className="p-8 space-y-5">
              {showModal === 'DEADLINES' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Deadline Name</label>
                    <input className="w-full px-4 py-3 rounded-xl border border-slate-200" value={newDeadline.name || ''} onChange={e => setNewDeadline({...newDeadline, name: e.target.value})} placeholder="e.g. Visa Pre-Registration" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Date</label>
                      <input type="date" className="w-full px-4 py-3 rounded-xl border border-slate-200" value={newDeadline.date || ''} onChange={e => setNewDeadline({...newDeadline, date: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Applies To</label>
                      <select className="w-full px-4 py-3 rounded-xl border border-slate-200" value={newDeadline.appliesTo} onChange={e => setNewDeadline({...newDeadline, appliesTo: e.target.value as CandidateType})}>
                        <option value={CandidateType.BOTH}>Both (EU & Non-EU)</option>
                        <option value={CandidateType.EU}>EU Only</option>
                        <option value={CandidateType.NON_EU}>Non-EU Only</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Specific University (Optional)</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200" value={newDeadline.universityId || ''} onChange={e => setNewDeadline({...newDeadline, universityId: e.target.value || undefined})}>
                      <option value="">All Universities</option>
                      {universities.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Reminder Frequency</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200" value={newDeadline.reminderFrequency} onChange={e => setNewDeadline({...newDeadline, reminderFrequency: e.target.value as ReminderFrequency})}>
                      {Object.values(ReminderFrequency).map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <button onClick={addDeadline} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black shadow-lg">CREATE DEADLINE</button>
                </>
              )}

              {showModal === 'REQUIREMENTS' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Requirement Name</label>
                    <input className="w-full px-4 py-3 rounded-xl border border-slate-200" value={newRequirement.name || ''} onChange={e => setNewRequirement({...newRequirement, name: e.target.value})} placeholder="e.g. Upload High School Diploma" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Workflow Stage</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200" value={newRequirement.stageId} onChange={e => setNewRequirement({...newRequirement, stageId: e.target.value})}>
                      {stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Applies To</label>
                      <select className="w-full px-4 py-3 rounded-xl border border-slate-200" value={newRequirement.appliesTo} onChange={e => setNewRequirement({...newRequirement, appliesTo: e.target.value as CandidateType})}>
                        <option value={CandidateType.BOTH}>Both</option>
                        <option value={CandidateType.EU}>EU Only</option>
                        <option value={CandidateType.NON_EU}>Non-EU Only</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Due Date (Opt.)</label>
                      <input type="date" className="w-full px-4 py-3 rounded-xl border border-slate-200" value={newRequirement.dueBy || ''} onChange={e => setNewRequirement({...newRequirement, dueBy: e.target.value})} />
                    </div>
                  </div>
                  <button onClick={addRequirement} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black shadow-lg">ADD REQUIREMENT</button>
                </>
              )}

              {showModal === 'UNIVERSITIES' && (
                <>
                  <input className="w-full px-4 py-3 rounded-xl border border-slate-200" value={newUni.name || ''} onChange={e => setNewUni({...newUni, name: e.target.value})} placeholder="University Name" />
                  <input className="w-full px-4 py-3 rounded-xl border border-slate-200" value={newUni.city || ''} onChange={e => setNewUni({...newUni, city: e.target.value})} placeholder="City" />
                  <input className="w-full px-4 py-3 rounded-xl border border-slate-200" value={newUni.website || ''} onChange={e => setNewUni({...newUni, website: e.target.value})} placeholder="Website URL" />
                  <textarea className="w-full px-4 py-3 rounded-xl border border-slate-200" value={newUni.description || ''} onChange={e => setNewUni({...newUni, description: e.target.value})} placeholder="Short Description" rows={3} />
                  <button onClick={addUniversity} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black shadow-lg">SAVE UNIVERSITY</button>
                </>
              )}

              {showModal === 'STAGES' && (
                <>
                  <input className="w-full px-4 py-3 rounded-xl border border-slate-200" value={newStage.name || ''} onChange={e => setNewStage({...newStage, name: e.target.value})} placeholder="Stage Name (e.g. Visa Interview)" />
                  <input type="number" className="w-full px-4 py-3 rounded-xl border border-slate-200" value={newStage.order || ''} onChange={e => setNewStage({...newStage, order: parseInt(e.target.value)})} placeholder="Display Order Index" />
                  <button onClick={addStage} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black shadow-lg">CREATE STAGE</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
