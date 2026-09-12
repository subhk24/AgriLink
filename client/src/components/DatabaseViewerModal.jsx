import React, { useState, useEffect } from 'react';
import {
  Database,
  RefreshCw,
  X,
  CheckCircle2,
  Code,
  Table as TableIcon,
  HardDrive,
  Terminal,
  Sparkles,
  Trash2
} from 'lucide-react';
import { inspectDatabase, seedDemoDatabase, clearUserData } from '../services/api';

export default function DatabaseViewerModal({ isOpen, onClose, currentUser, onDataRefreshed }) {
  const [dbData, setDbData] = useState(null);
  const [selectedTable, setSelectedTable] = useState('users');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'json'
  const [loading, setLoading] = useState(false);
  const [actionNotice, setActionNotice] = useState('');

  const fetchDbState = async () => {
    setLoading(true);
    try {
      const res = await inspectDatabase();
      setDbData(res);
    } catch (err) {
      console.error("Failed to inspect database", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDbState();
    }
  }, [isOpen]);

  const handleSeedDemo = async () => {
    setLoading(true);
    setActionNotice('');
    try {
      const res = await seedDemoDatabase();
      setActionNotice(res.message);
      await fetchDbState();
      if (onDataRefreshed) onDataRefreshed();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearUser = async () => {
    if (!currentUser) return;
    setLoading(true);
    setActionNotice('');
    try {
      const res = await clearUserData(currentUser.id);
      setActionNotice(`User ${currentUser.name}'s data cleared to fresh empty state.`);
      await fetchDbState();
      if (onDataRefreshed) onDataRefreshed();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentRows = dbData?.tables?.[selectedTable] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-950 text-slate-100 rounded-3xl shadow-2xl border border-slate-800 w-full max-w-5xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900/90 border-b border-slate-800 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-white">Live SQLite Database Inspector</h3>
                <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono font-bold px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>On-Disk Persistent</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Storage: <span className="text-emerald-300 font-bold">{dbData?.dbPath || 'server/data/agrilink.db'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700 text-xs">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  viewMode === 'table' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                onClick={() => setViewMode('json')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  viewMode === 'json' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">JSON</span>
              </button>
            </div>

            <button
              onClick={fetchDbState}
              title="Refresh database state"
              className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl border border-slate-700 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl border border-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Notice */}
        {actionNotice && (
          <div className="bg-emerald-950/80 border-b border-emerald-800/40 text-emerald-300 px-4 py-2 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Table Selector Tabs */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          {['users', 'produce_listings', 'pooling_clusters', 'cluster_members', 'escrow_transactions', 'sql_logs'].map((tableName) => {
            const count = tableName === 'sql_logs'
              ? (dbData?.recentSqlLogs?.length || 0)
              : (dbData?.tableCounts?.[tableName] || 0);

            const isSelected = selectedTable === tableName;

            return (
              <button
                key={tableName}
                onClick={() => setSelectedTable(tableName)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {tableName === 'sql_logs' ? <Terminal className="w-3.5 h-3.5" /> : <TableIcon className="w-3.5 h-3.5" />}
                <span>{tableName}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-950/90 text-xs font-mono">
          {selectedTable === 'sql_logs' ? (
            /* Live SQL Activity Feed */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="font-bold text-slate-200">Recent Real-Time SQL Queries Executed:</span>
                <span>{dbData?.recentSqlLogs?.length || 0} query statements</span>
              </div>
              <div className="space-y-2 font-mono">
                {dbData?.recentSqlLogs?.map((log, idx) => (
                  <div key={log.id || idx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span className="text-emerald-400 font-bold">Statement #{idx + 1}</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-slate-200 text-xs break-all text-amber-300 font-medium">
                      {log.query}
                    </div>
                    {log.params && (
                      <div className="text-[11px] text-slate-400">
                        Params: <span className="text-teal-300">{log.params}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : viewMode === 'json' ? (
            <pre className="text-emerald-400 bg-slate-900 p-4 rounded-2xl overflow-x-auto border border-slate-800">
              {JSON.stringify(currentRows, null, 2)}
            </pre>
          ) : currentRows.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
              <Database className="w-8 h-8 text-slate-600" />
              <span className="font-bold text-slate-400">Table is Currently Empty (0 Records)</span>
              <p className="text-slate-600 max-w-sm text-[11px]">
                When you register a user, list produce, or join a pool, records are written in real-time to SQLite.
              </p>
            </div>
          ) : (
            /* Tabular Grid View */
            <div className="overflow-x-auto border border-slate-800 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
                    {Object.keys(currentRows[0]).map((key) => (
                      <th key={key} className="py-3 px-3.5 whitespace-nowrap font-bold text-slate-300">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {currentRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-900/60 transition-colors">
                      {Object.values(row).map((val, cIdx) => (
                        <td key={cIdx} className="py-2.5 px-3.5 whitespace-nowrap text-[11px]">
                          {val === null || val === undefined ? (
                            <span className="text-slate-600 italic">NULL</span>
                          ) : typeof val === 'boolean' ? (
                            val ? 'TRUE' : 'FALSE'
                          ) : (
                            String(val)
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-900 border-t border-slate-800 p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-400 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <span>Demonstrates real SQLite schema, CRUD operations & relational integrity for judges</span>
          </div>

          <div className="flex items-center gap-2">
            {currentUser && !currentUser.is_demo_user && (
              <button
                onClick={handleClearUser}
                disabled={loading}
                className="flex items-center gap-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/60 px-3 py-1.5 rounded-xl font-bold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset User to Empty</span>
              </button>
            )}

            <button
              onClick={handleSeedDemo}
              disabled={loading}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl font-bold transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Seed Demo Project Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
