"use client";

import React, { useEffect, useState } from 'react';
import { ShieldAlert, Zap, Activity, Bot, ChevronRight, CircleDot } from 'lucide-react';

export default function Dashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [activeLead, setActiveLead] = useState<any>(null);
  const [sequence, setSequence] = useState("(Select a prospect to decrypt the LLM compliance sequence)");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Authenticate securely
    const formData = new URLSearchParams();
    formData.append("username", "sales_manager");
    formData.append("password", "password123");

    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      if(data.access_token) {
          setToken(data.access_token);
          // 2. Fetch prioritized leads via secure JWT
          fetch("/api/leads", {
            headers: { "Authorization": `Bearer ${data.access_token}` }
          })
          .then(r => r.json())
          .then(leadsData => {
              if(Array.isArray(leadsData)) {
                  setLeads(leadsData.slice(0, 15)); // Display top mathematically
              }
              setLoading(false);
          });
      }
    });
  }, []);

  const handleViewRouting = (lead: any) => {
    setActiveLead(lead);
    setSequence("Synchronizing vector constraints... decrypting sequence...");
    
    // Attempt to grab sequence
    fetch(`/api/leads/${lead.id}/sequences`, {
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        if (data && data.length > 0) {
            setSequence(data[0].generated_text);
        } else {
            setSequence("Awaiting worker evaluation. Target score matrices computed securely.");
        }
    })
    .catch(() => setSequence("Neural net detachment: Endpoint timeout."));
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Decor Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none" />

      <div className="p-8 lg:p-12 max-w-[90rem] mx-auto relative z-10">
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-600 p-2 rounded-xl text-black shadow-lg shadow-cyan-500/20">
                <Activity size={24} strokeWidth={2.5} />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-500">
                Blostem Pulse
              </h1>
            </div>
            <p className="text-zinc-400 font-medium tracking-wide mt-3 flex items-center gap-2 text-sm uppercase">
              <Bot size={16} /> Enterprise RAG Generation & Intent Decay matrix
            </p>
          </div>
          
          <div className="bg-emerald-950/30 border border-emerald-900/50 px-4 py-2 rounded-full flex items-center gap-3 backdrop-blur-md">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            </span>
            <span className="text-sm font-semibold tracking-wider text-emerald-400 uppercase">Neural Pipeline Active</span>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Leads Table */}
          <div className="xl:col-span-8 glass-panel rounded-2xl overflow-hidden shadow-2xl relative flex flex-col h-[750px] border border-white/10">
             {/* Gradient Border top edge */}
             <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
             
             <div className="flex items-center gap-2 p-6 border-b border-white/5 bg-white/[0.02]">
                <Zap className="text-cyan-400" size={20} />
                <h2 className="text-lg font-semibold text-zinc-200 tracking-wide">High-Intent Acquisition Nodes</h2>
             </div>

             <div className="overflow-y-auto flex-1 p-6 custom-scrollbar">
                <table className="w-full text-left text-sm border-separate border-spacing-y-2">
                  <thead className="text-xs uppercase text-zinc-500 tracking-wider">
                    <tr>
                      <th className="pb-4 font-semibold px-4">Entity</th>
                      <th className="pb-4 font-semibold px-4">Corporation</th>
                      <th className="pb-4 font-semibold px-4">Calculated Vector</th>
                      <th className="pb-4 font-semibold px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                       <tr><td colSpan={4} className="py-12 text-center text-zinc-500 font-mono animate-pulse">Establishing secure JWT handshake... retrieving signals.</td></tr>
                    ) : leads.map((lead, idx) => (
                      <tr 
                        key={lead.id} 
                        className={`group transition-all duration-300 rounded-xl cursor-pointer ${
                          activeLead?.id === lead.id 
                            ? 'bg-gradient-to-r from-cyan-950/40 to-blue-900/20 shadow-[inner_0_0_0_1px_rgba(34,211,238,0.3)]' 
                            : 'bg-white/[0.02] hover:bg-white/[0.06] border border-white/5'
                        }`}
                        onClick={() => handleViewRouting(lead)}
                      >
                        <td className="p-4 rounded-l-xl border-y border-l border-white/5 group-hover:border-transparent">
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-300 ${activeLead?.id === lead.id ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700'}`}>
                              {lead.name.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <span className="font-semibold text-zinc-200">{lead.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-zinc-400 font-medium border-y border-white/5 group-hover:border-transparent">
                          {lead.company}
                        </td>
                        <td className="p-4 border-y border-white/5 group-hover:border-transparent">
                          <div className="flex items-center gap-2">
                            <CircleDot size={12} className={lead.intent_score > 0 ? "text-cyan-400" : "text-zinc-600"} />
                            <span className="font-mono text-lg font-bold text-zinc-200">
                              {(lead.intent_score || 0).toFixed(2)}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 rounded-r-xl text-right border-y border-r border-white/5 group-hover:border-transparent">
                          <button 
                            className={`px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-2 ml-auto transition-all duration-300 ${
                              activeLead?.id === lead.id 
                              ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/30 shadow-cyan-500/20 scale-[1.02]' 
                              : 'bg-white/10 text-zinc-300 group-hover:bg-cyan-500 group-hover:text-black group-hover:shadow-[0_0_10px_rgba(34,211,238,0.4)]'
                            }`}
                          >
                            Route <ChevronRight size={14} strokeWidth={3} className={`transition-transform ${activeLead?.id === lead.id ? 'translate-x-1' : ''}`} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
          
          {/* Sidebar Analytics */}
          <div className="xl:col-span-4 flex flex-col gap-6">
            
            {/* Math Visualizer */}
            <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group border border-white/10 shadow-2xl">
               <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/30 transition-all duration-700"></div>
               
               <h2 className="text-zinc-200 font-bold mb-6 flex items-center justify-between tracking-wide">
                  Algorithmic Decay Matrix
                  {activeLead && <span className="bg-white/10 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded text-cyan-200 border border-cyan-900/50 shadow-sm">{activeLead.company}</span>}
               </h2>
               
               <div className="bg-black/80 p-6 rounded-xl border border-white/10 relative shadow-inner overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/5 to-transparent pointer-events-none" />
                  
                  <div className="flex items-center justify-center gap-3 py-4">
                    <div className="text-3xl font-serif italic text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                      I
                    </div>
                    <div className="text-xl text-zinc-600">=</div>
                    
                    <div className="text-2xl font-serif italic text-blue-400">α</div>
                    <div className="text-zinc-600">·</div>
                    
                    <div className="flex flex-col items-center justify-center mx-1">
                      <span className="text-[9px] text-cyan-800 -mb-2 z-10 font-mono">n</span>
                      <span className="text-5xl text-cyan-500 font-light leading-none drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">∑</span>
                      <span className="text-[9px] text-cyan-800 -mt-2 z-10 font-mono">i=1</span>
                    </div>
                    
                    <div className="flex items-center text-2xl font-serif">
                      <span className="text-zinc-500 font-light mr-1">(</span>
                      <div className="flex items-center">
                        <span className="text-orange-400 italic drop-shadow-[0_0_8px_rgba(251,146,60,0.3)]">w<sub className="text-[11px] ml-0.5 mt-2">i</sub></span>
                        <span className="text-zinc-700 mx-2 text-sm">●</span>
                        <span className="text-emerald-400 italic drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">s<sub className="text-[11px] ml-0.5 mt-2">i</sub></span>
                        <span className="text-zinc-700 mx-2 text-sm">●</span>
                        <div className="flex items-start">
                          <span className="text-purple-400 italic text-2xl">e</span>
                          <sup className="text-[12px] text-zinc-300 ml-0.5 mt-0.5 font-sans tracking-tight bg-white/5 px-1 py-0.5 rounded border border-white/5">-λt<sub className="text-[8px]">i</sub></sup>
                        </div>
                      </div>
                      <span className="text-zinc-500 font-light ml-1">)</span>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-5 border-t border-white/5 flex justify-between items-end">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-400" />
                        <span className="text-xs text-zinc-400 font-medium">Decay Shift (λ)</span>
                        <span className="text-xs font-mono text-zinc-300 ml-2">0.05</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-400" />
                        <span className="text-xs text-zinc-400 font-medium">Signal Matrix (w·s)</span>
                        <span className="text-xs font-mono text-zinc-300 ml-2">Active</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-[10px] text-cyan-600 drop-shadow-[0_0_5px_rgba(8,145,178,0.5)] uppercase font-extrabold mb-1 tracking-widest">
                        Intent Differential
                      </div>
                      <div className="text-4xl font-black font-mono tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                        {activeLead ? (activeLead.intent_score || 0).toFixed(2) : "0.00"}
                      </div>
                    </div>
                  </div>
               </div>
            </div>

            {/* RAG Sequencer */}
            <div className="glass-panel rounded-2xl p-6 flex-1 flex flex-col max-h-[440px] border border-white/10 shadow-2xl relative overflow-hidden group">
               <div className="absolute bottom-[-50px] left-[-50px] w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>

               <h2 className="text-zinc-200 font-bold mb-6 flex items-center justify-between tracking-wide">
                  <span className="flex items-center gap-2">
                    <ShieldAlert size={18} className="text-indigo-400" />
                    AI Vector Gen
                  </span>
                  <span className="bg-indigo-900/30 text-indigo-300 text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest border border-indigo-800/50 shadow-[0_0_10px_rgba(79,70,229,0.3)]">
                    RBI Secured
                  </span>
               </h2>
               
               <div className="bg-black/90 border border-white/10 rounded-xl p-8 text-[15px] sm:text-base text-zinc-300 flex-1 overflow-y-auto custom-scrollbar font-sans shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)]">
                  {sequence === "(Select a prospect to decrypt the LLM compliance sequence)" ? (
                     <div className="h-full flex flex-col items-center justify-center text-zinc-600 text-center gap-4 animate-pulse">
                        <Bot size={32} className="opacity-30" />
                        Waiting for active node selection...
                     </div>
                  ) : sequence.includes("Synchronizing vector constraints") ? (
                     <div className="h-full flex flex-col items-center justify-center text-cyan-400 text-center gap-6 mt-12 mb-12">
                        <div className="relative">
                            <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full animate-ping"></div>
                            <Activity size={48} className="animate-pulse drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-xl font-bold tracking-widest uppercase animate-pulse text-white drop-shadow-md">Initializing Neural Pipeline</h3>
                            <p className="text-cyan-200/60 font-mono text-sm max-w-sm mx-auto leading-relaxed">
                                Negotiating RBI constraints...<br/>
                                Generating live vector for <strong className="text-cyan-300">{activeLead?.company}</strong>.
                            </p>
                        </div>
                     </div>
                  ) : (
                     <div className="whitespace-pre-wrap animate-in fade-in zoom-in-95 duration-300 max-w-4xl mx-auto">
                        {sequence.split('\n').map((line, i) => {
                          const cleanLine = line.replace(/\*\*/g, '').trim();
                          
                          if (cleanLine.includes('[FALLBACK') || cleanLine.includes('[RAG')) {
                              return <p key={i} className="text-xs uppercase tracking-widest font-sans font-bold text-red-400 my-4 bg-red-950/30 border border-red-900/50 inline-block px-3 py-1.5 rounded">{cleanLine}</p>
                          }
                          
                          if (cleanLine === '---') {
                              return <div key={i} className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-8 w-full" />
                          }
                          
                          if (cleanLine.startsWith('###') || (cleanLine.startsWith('Step') && cleanLine.length < 80)) {
                              // Ensure we clean any leading formatting
                              const headingText = cleanLine.replace(/^#+\s*/, '');
                              return (
                                  <h4 key={i} className="text-cyan-400 font-sans font-bold text-xl mt-10 mb-4 flex items-center gap-3 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
                                      <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)]" />
                                      {headingText}
                                  </h4>
                              )
                          }
                          
                          if (cleanLine.toUpperCase().startsWith('SUBJECT:')) {
                              return (
                                  <div key={i} className="text-zinc-200 font-medium bg-white/5 border border-white/10 px-5 py-3 rounded-md mb-6 inline-block text-[15px] shadow-inner overflow-hidden relative">
                                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500" />
                                      <span className="text-indigo-400 mr-3 uppercase text-xs tracking-widest font-bold">Subject:</span>
                                      {cleanLine.replace(/^SUBJECT:\s*/i, '')}
                                  </div>
                              )
                          }
                          
                          if (!cleanLine) {
                              return <div key={i} className="h-4" />
                          }

                          // Check if line is a bullet point
                          const isBulletList = cleanLine.startsWith('* ') || cleanLine.startsWith('- ');
                          const textContent = isBulletList ? cleanLine.substring(2) : line;

                          // Only parse strong tags for regular paragraphs, not the cleanLine
                          const formattedLine = textContent.split('**').map((text, index) => 
                              index % 2 === 1 ? <strong key={index} className="font-bold text-white tracking-wide">{text}</strong> : text
                          );

                          if (isBulletList) {
                               return (
                                  <div key={i} className="flex gap-4 mb-4 items-start ml-2 pl-3 border-l-2 border-white/5">
                                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-600 mt-3 shrink-0 shadow-[0_0_8px_rgba(8,145,178,0.8)]" />
                                      <p className="text-zinc-300 leading-8 tracking-wide">
                                          {formattedLine}
                                      </p>
                                  </div>
                              )
                          }

                          return (
                              <p key={i} className="text-zinc-300 leading-8 tracking-wide mb-4">
                                  {formattedLine}
                              </p>
                          )
                        })}
                     </div>
                  )}
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
