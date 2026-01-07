
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems: { id: AppView; label: string; icon: string }[] = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: 'fa-chart-line' },
    { id: 'CLIENTS', label: 'Clients', icon: 'fa-users' },
    { id: 'INTAKE', label: 'New Intake', icon: 'fa-user-plus' },
    { id: 'UNIVERSITIES', label: 'Universities', icon: 'fa-university' },
    { id: 'DEADLINES', label: 'Deadlines', icon: 'fa-calendar-alt' },
    { id: 'REQUIREMENTS', label: 'Requirements', icon: 'fa-clipboard-list' },
    { id: 'STAGES', label: 'Workflow Stages', icon: 'fa-layer-group' },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 z-50 shadow-xl">
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">IB</div>
        <h1 className="text-xl font-bold tracking-tight">IMAT Buddy</h1>
      </div>
      
      <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              currentView === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <i className={`fas ${item.icon} w-5`}></i>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        &copy; 2024 IMAT Buddy <br/> Consultant Portal v1.0
      </div>
    </div>
  );
};

export default Sidebar;
