import React, { useState, useEffect } from 'react';
import {
  Database,
  RefreshCw,
  ArrowLeft,
  Table as TableIcon,
  Code,
  Terminal,
  Sparkles,
  Trash2
} from 'lucide-react';
import { inspectDatabase, seedDemoDatabase } from '../services/api';

export default function DatabasePage() {
  const [dbData, setDbData] = useState(null);
  const [selectedTable, setSelectedTable] = useState('users');
  const [viewMode, setViewMode] = useState('table');
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
    fetchDbState();
  }, []);

  const handleSeedDemo = async () => {
    setLoading(true);
    setActionNotice('');
    try {
      const res = await seedDemoDatabase();
      setActionNotice(res.message);
      await fetchDbState();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentRows = dbData?.tables?.[selectedTable] || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-mono text-xs">
      {/* Top Header */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="flex items-center gap-1.5 text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg transition-colors font-sans text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to AgriLink App</span>
          </a>

          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <h1 className="font-bold text-white text-sm">SQLite Database Inspector</h1>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              server/data/agrilink.db
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                viewMode === 'table' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('json')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                viewMode === 'json' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'
              }`}
            >
              JSON View
            </button>
          </div>

          <button
            onClick={fetchDbState}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg border border-slate-700 transition-colors"
            title="Refresh tables"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          <button
            onClick={handleSeedDemo}
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-sans font-medium text-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Seed Sample Data</span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="bg-emerald-950 border-b border-emerald-800/60 text-emerald-300 px-4 py-2 text-xs">
          {actionNotice}
        </div>
      )}

      {/* Table Selector Tabs */}
      <div className="bg-slate-900/50 border-b border-slate-800 px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs">
        {['users', 'produce_listings', 'pooling_clusters', 'cluster_members', 'escrow_transactions', 'sql_logs'].map((tableName) => {
          const count = tableName === 'sql_logs'
            ? (dbData?.recentSqlLogs?.length || 0)
            : (dbData?.tableCounts?.[tableName] || 0);

          const isSelected = selectedTable === tableName;

          return (
            <button
              key={tableName}
              onClick={() => setSelectedTable(tableName)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors border ${
                isSelected
                  ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
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

      {/* Main Grid View */}
      <div className="flex-1 p-4 overflow-auto">
        {selectedTable === 'sql_logs' ? (
          <div className="space-y-2">
            <div className="text-slate-400 mb-2">Executed SQL Statements Log:</div>
            {dbData?.recentSqlLogs?.map((log, idx) => (
              <div key={log.id || idx} className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span className="text-emerald-400 font-bold">Query #{idx + 1}</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="text-amber-300">{log.query}</div>
                {log.params && <div className="text-slate-400 text-[11px]">Params: {log.params}</div>}
              </div>
            ))}
          </div>
        ) : viewMode === 'json' ? (
          <pre className="text-emerald-400 bg-slate-900 p-4 rounded-xl overflow-x-auto border border-slate-800">
            {JSON.stringify(currentRows, null, 2)}
          </pre>
        ) : currentRows.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-500 space-y-2">
            <Database className="w-8 h-8 text-slate-600" />
            <span>Table is empty (0 records)</span>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                  {Object.keys(currentRows[0]).map((k) => (
                    <th key={k} className="py-2.5 px-3 whitespace-nowrap font-bold text-slate-300">
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {currentRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-900/50">
                    {Object.values(row).map((val, cIdx) => (
                      <td key={cIdx} className="py-2 px-3 whitespace-nowrap text-[11px]">
                        {val === null || val === undefined ? (
                          <span className="text-slate-600 italic">NULL</span>
                        ) : String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
