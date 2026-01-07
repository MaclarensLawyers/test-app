
import React from 'react';
import { Client, Stage, Requirement, CandidateType } from '../types';

interface ClientTrackerProps {
  client: Client;
  stages: Stage[];
  requirements: Requirement[];
  onToggleRequirement: (clientId: string, requirementId: string) => void;
}

const ClientTracker: React.FC<ClientTrackerProps> = ({ client, stages, requirements, onToggleRequirement }) => {
  // Filter requirements relevant to this client
  const clientRequirements = requirements.filter(req => {
    const typeMatch = req.appliesTo === CandidateType.BOTH || req.appliesTo === client.candidateType;
    const uniMatch = !req.universityId || client.preferredUniversities.includes(req.universityId);
    return typeMatch && uniMatch;
  });

  const sortedStages = [...stages].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold">
            {client.firstName[0]}{client.lastName[0]}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">{client.firstName} {client.lastName}</h3>
            <div className="flex items-center space-x-3 text-sm">
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${client.candidateType === CandidateType.EU ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {client.candidateType === CandidateType.EU ? 'EU' : 'Non-EU'}
              </span>
              <span className="text-slate-500"><i className="fas fa-envelope mr-1"></i> {client.email}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-blue-600">
            {Math.round((client.completedRequirementIds.length / (clientRequirements.length || 1)) * 100)}%
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progress</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sortedStages.map((stage) => {
          const stageReqs = clientRequirements.filter(r => r.stageId === stage.id);
          const completedCount = stageReqs.filter(r => client.completedRequirementIds.includes(r.id)).length;
          const isComplete = stageReqs.length > 0 && completedCount === stageReqs.length;

          return (
            <div key={stage.id} className={`flex flex-col h-full bg-white rounded-2xl border-t-4 shadow-sm border border-slate-200 p-5 ${isComplete ? 'border-t-green-500' : 'border-t-blue-500'}`}>
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-slate-800 leading-tight pr-2">{stage.name}</h4>
                <div className={`text-xs px-2 py-1 rounded-full font-bold whitespace-nowrap ${isComplete ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                  {completedCount}/{stageReqs.length}
                </div>
              </div>

              <div className="flex-1 space-y-3">
                {stageReqs.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No requirements for this stage.</p>
                ) : (
                  stageReqs.map(req => (
                    <button
                      key={req.id}
                      onClick={() => onToggleRequirement(client.id, req.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all text-sm group ${
                        client.completedRequirementIds.includes(req.id)
                          ? 'bg-green-50 border-green-200 text-green-800'
                          : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`mt-0.5 w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors ${
                          client.completedRequirementIds.includes(req.id)
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'bg-white border-slate-300 group-hover:border-blue-400'
                        }`}>
                          {client.completedRequirementIds.includes(req.id) && <i className="fas fa-check text-[10px]"></i>}
                        </div>
                        <div className="flex flex-col">
                          <span className={`font-semibold ${client.completedRequirementIds.includes(req.id) ? 'line-through opacity-70' : ''}`}>
                            {req.name}
                          </span>
                          {req.dueBy && (
                            <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">
                              Due: {new Date(req.dueBy).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClientTracker;
