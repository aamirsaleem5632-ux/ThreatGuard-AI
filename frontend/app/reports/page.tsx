'use client';

import React, { useEffect, useState } from 'react';
import { FileText, Printer, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import type { Investigation } from '@/lib/types';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('executive');
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [selectedInvestigationId, setSelectedInvestigationId] = useState('');
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [isLoadingInvestigations, setIsLoadingInvestigations] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedInvestigation = investigations.find(
    (item) => item.id === selectedInvestigationId
  );

  useEffect(() => {
    let isMounted = true;

    const loadInvestigations = async () => {
      try {
        setIsLoadingInvestigations(true);
        setLoadError(null);

        const data = await api.getReportInvestigations();

        if (!isMounted) return;

        setInvestigations(data);
        if (data.length > 0) {
          setSelectedInvestigationId(data[0].id);
        }
      } catch (err) {
        if (!isMounted) return;
        setLoadError(
          err instanceof Error
            ? err.message
            : 'Unable to load investigations. Please try again.'
        );
      } finally {
        if (isMounted) setIsLoadingInvestigations(false);
      }
    };

    loadInvestigations();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleGenerate = async () => {
    if (!selectedInvestigationId) {
      setError('Please select an investigation first.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedReport(null);

    try {
      const result = await api.generateReport({
        report_type: reportType,
        investigation_id: selectedInvestigationId,
      });

      setGeneratedReport(result.content);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to generate report. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0B0A10] border border-purple-500/15 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse"></span>
            <span className="text-xs font-mono text-purple-300 uppercase tracking-wider font-bold">
              Enterprise Reporting Center
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide mt-1">
            Executive & Technical Briefing Generator
          </h1>
          <p className="text-xs text-zinc-400 font-mono">
            Generate reports from stored investigation and security evidence
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            disabled={!generatedReport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#030305] hover:bg-[#0F0E18] border border-purple-500/15 text-xs font-mono text-white disabled:opacity-40 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-400" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="p-6 rounded-2xl bg-[#0B0A10] border border-purple-500/15 space-y-4">
          <div className="text-xs font-bold font-mono text-white uppercase pb-2 border-b border-purple-500/15">
            Report Parameters
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-zinc-400 mb-1 uppercase text-[10px]">
                Select Investigation:
              </label>
              <select
                value={selectedInvestigationId}
                onChange={(e) => {
                  setSelectedInvestigationId(e.target.value);
                  setGeneratedReport(null);
                  setError(null);
                }}
                disabled={isLoadingInvestigations || investigations.length === 0}
                className="w-full bg-[#030305] border border-purple-500/15 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500 text-xs disabled:opacity-50"
              >
                <option value="">
                  {isLoadingInvestigations
                    ? 'Loading investigations...'
                    : 'Select an investigation'}
                </option>
                {investigations.map((investigation) => (
                  <option key={investigation.id} value={investigation.id}>
                    {investigation.title} — {investigation.indicator}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 uppercase text-[10px]">
                Select Template:
              </label>
              <select
                value={reportType}
                onChange={(e) => {
                  setReportType(e.target.value);
                  setGeneratedReport(null);
                  setError(null);
                }}
                className="w-full bg-[#030305] border border-purple-500/15 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500 text-xs"
              >
                <option value="executive">Executive Board Briefing</option>
                <option value="technical">Technical Forensic Brief</option>
                <option value="incident">Incident Response Audit Trail</option>
                <option value="compliance">NIST CSF 2.0 Compliance Review</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 uppercase text-[10px]">
                Scope:
              </label>
              <div className="p-2.5 rounded-lg bg-[#030305] border border-purple-500/15 text-white break-words">
                {selectedInvestigation ? (
                  <>
                    <p>{selectedInvestigation.title}</p>
                    <p className="text-zinc-400 mt-1">
                      {selectedInvestigation.indicator}
                    </p>
                    <p className="text-zinc-500 mt-1">
                      {selectedInvestigation.indicator_type}
                    </p>
                  </>
                ) : (
                  <span className="text-zinc-500">
                    {isLoadingInvestigations
                      ? 'Loading investigation data...'
                      : 'No investigation selected'}
                  </span>
                )}
              </div>
            </div>

            {loadError && (
              <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/30 text-red-300 break-words">
                {loadError}
              </div>
            )}

            {!isLoadingInvestigations &&
              !loadError &&
              investigations.length === 0 && (
                <div className="p-3 rounded-lg bg-yellow-950/20 border border-yellow-500/20 text-yellow-300">
                  No investigations found. Create an investigation first.
                </div>
              )}

            {error && (
              <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/30 text-red-300 break-words">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={
                isGenerating ||
                isLoadingInvestigations ||
                !selectedInvestigationId
              }
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-900/40 via-violet-800/20 to-transparent hover:from-purple-800/50 hover:to-violet-700/30 text-purple-200 border border-purple-500/30 font-bold text-xs shadow-[0_0_15px_rgba(201,168,68,0.2)] disabled:opacity-40 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>
                {isGenerating ? 'Compiling Evidence...' : 'Generate Report'}
              </span>
            </button>
          </div>
        </div>

        {/* Report Preview */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0B0A10] border border-purple-500/15 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-purple-500/15">
            <span className="font-bold text-white uppercase">
              Live Document Preview
            </span>
            <span className="text-[10px] text-purple-300 px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/25">
              Backend Investigation Data
            </span>
          </div>

          {generatedReport ? (
            <div className="p-6 rounded-xl bg-[#030305] text-white/90 leading-relaxed whitespace-pre-wrap border border-purple-500/15">
              {generatedReport}
            </div>
          ) : (
            <div className="py-20 text-center text-zinc-500 space-y-2">
              <FileText className="w-8 h-8 mx-auto text-zinc-700" />
              <p>
                Select an investigation and report template, then click
                &ldquo;Generate Report&rdquo;.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
