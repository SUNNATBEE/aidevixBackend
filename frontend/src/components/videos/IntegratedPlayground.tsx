'use client';

import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoPlay, IoRefresh, IoCodeSlash, IoTerminal, IoEye, IoChevronDown, IoChevronUp, IoExpand } from 'react-icons/io5';
import Link from 'next/link';

interface IntegratedPlaygroundProps {
  videoId: string;
  category?: string;
  initialCode?: string;
}

declare global {
  interface Window {
    loadPyodide: any;
  }
}

export default function IntegratedPlayground({ videoId, category = 'html', initialCode }: IntegratedPlaygroundProps) {
  const [code, setCode] = useState(initialCode || '');
  const [output, setOutput] = useState<{ type: 'log' | 'error' | 'info'; content: string }[]>([]);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isExpanded, setIsExpanded] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [pyodide, setPyodide] = useState<any>(null);
  const [isPyodideLoading, setIsPyodideLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Load Pyodide if needed
  useEffect(() => {
    if ((category === 'python' || category === 'ai') && !pyodide && !isPyodideLoading) {
      setIsPyodideLoading(true);
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
      script.async = true;
      script.onload = async () => {
        const py = await window.loadPyodide();
        setPyodide(py);
        setIsPyodideLoading(false);
      };
      document.body.appendChild(script);
    }
  }, [category, pyodide, isPyodideLoading]);

  // Default code based on category
  useEffect(() => {
    if (!initialCode) {
      if (category === 'html') {
        setCode('<!DOCTYPE html>\n<html>\n<head>\n<style>\n  body { font-family: sans-serif; background: #0f172a; color: white; padding: 20px; }\n  h1 { color: #6366f1; }\n</style>\n</head>\n<body>\n  <h1>Salom Aidevix!</h1>\n  <p>Bu yerda HTML kodingizni yozing...</p>\n</body>\n</html>');
      } else if (category === 'javascript' || category === 'nodejs') {
        setCode('// JavaScript kodingizni yozing\nconsole.log("Salom Aidevix!");\n\nfunction salom(ism) {\n  return "Assalomu alaykum, " + ism + "!";\n}\n\nconsole.log(salom("O\'quvchi"));');
      } else {
        setCode('# Python kodingizni yozing\nprint("Salom Aidevix!")\n\ndef salom(ism):\n    return f"Assalomu alaykum, {ism}!"\n\nprint(salom("O\'quvchi"))');
      }
    }
  }, [category, initialCode]);

  const runCode = async () => {
    setOutput([{ type: 'info', content: 'Bajarilmoqda...' }]);
    
    if (category === 'html' || category === 'css') {
      const blob = new Blob([code], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setActiveTab('preview');
      setOutput([{ type: 'log', content: 'Preview yangilandi' }]);
    } else if (category === 'python' || category === 'ai') {
      if (!pyodide) {
        setOutput([{ type: 'error', content: 'Pyodide hali yuklanmadi. Iltimos, bir oz kuting...' }]);
        return;
      }
      try {
        pyodide.runPython(`
          import sys
          import io
          sys.stdout = io.StringIO()
        `);
        await pyodide.runPythonAsync(code);
        const result = pyodide.runPython('sys.stdout.getvalue()');
        setOutput(result.split('\n').filter((l: string) => l).map((l: string) => ({ type: 'log', content: l })));
      } catch (err: any) {
        setOutput([{ type: 'error', content: err.message }]);
      }
    } else {
      // JavaScript/Python basic execution
      try {
        const logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args) => logs.push(args.join(' '));
        
        // Simple eval for JS
        if (category === 'javascript' || category === 'nodejs') {
          eval(code);
          setOutput(logs.map(l => ({ type: 'log', content: l })));
        } else {
          // Mock Python for now
          setOutput([
            { type: 'log', content: 'Python kodini bajarish uchun Pyodide yuklanmoqda...' },
            { type: 'info', content: 'Hozircha faqat JS eval ishlaydi.' }
          ]);
        }
        
        console.log = originalLog;
      } catch (err: any) {
        setOutput([{ type: 'error', content: err.message }]);
      }
    }
  };

  const resetCode = () => {
    if (confirm('Kodni tiklamoqchimisiz?')) {
      setInitialCode();
      setOutput([]);
    }
  };

  const setInitialCode = () => {
    // Logic same as useEffect
    if (category === 'html') {
      setCode('<!DOCTYPE html>\n<html>\n<head>\n<style>\n  body { font-family: sans-serif; background: #0f172a; color: white; padding: 20px; }\n  h1 { color: #6366f1; }\n</style>\n</head>\n<body>\n  <h1>Salom Aidevix!</h1>\n  <p>Bu yerda HTML kodingizni yozing...</p>\n</body>\n</html>');
    } else {
      setCode('// JavaScript/Python kodingizni yozing...');
    }
  };

  return (
    <div className="mt-8 bg-[#0d1224] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-6 py-4 bg-white/5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
            <IoCodeSlash size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Amaliyot (Playground)</h3>
            <p className="text-[10px] text-zinc-500 font-medium">Kodni yozing va natijani ko&apos;ring</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Link 
            href={`/videos/${videoId}/playground`}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all group"
          >
            <IoExpand size={14} className="group-hover:scale-110 transition-transform" />
            Full Screen
          </Link>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 transition-colors"
          >
            {isExpanded ? <IoChevronUp /> : <IoChevronDown />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 h-[500px]">
              {/* Editor Column */}
              <div className="flex flex-col border-r border-white/5 h-full">
                <div className="h-10 px-4 flex items-center bg-[#080914] border-b border-white/5">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Editor</span>
                </div>
                <div className="flex-1 min-h-0">
                  <Editor
                    height="100%"
                    defaultLanguage={category === 'html' ? 'html' : category === 'javascript' ? 'javascript' : 'python'}
                    theme="vs-dark"
                    value={code}
                    onChange={(val) => setCode(val || '')}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      padding: { top: 10 },
                      backgroundColor: '#0d1224',
                    }}
                  />
                </div>
                <div className="p-4 bg-[#080914] flex items-center justify-between gap-4">
                  <button
                    onClick={resetCode}
                    className="p-2 text-zinc-500 hover:text-white transition-colors"
                    title="Qayta tiklash"
                  >
                    <IoRefresh size={20} />
                  </button>
                  <div className="flex items-center gap-2 flex-1">
                    <button
                      onClick={runCode}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                    >
                      <IoPlay size={18} />
                      RUN CODE
                    </button>
                    <Link 
                      href={`/videos/${videoId}/playground`}
                      className="flex items-center justify-center w-12 py-3 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-xl border border-white/10 transition-all"
                      title="To'liq ekranda ochish"
                    >
                      <IoExpand size={18} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Output Column */}
              <div className="flex flex-col h-full bg-[#080914]">
                <div className="h-10 px-2 flex items-center justify-between border-b border-white/5">
                  <div className="flex">
                    <button 
                      onClick={() => setActiveTab('editor')}
                      className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'editor' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-zinc-500'}`}
                    >
                      Terminal
                    </button>
                    {(category === 'html' || category === 'css') && (
                      <button 
                        onClick={() => setActiveTab('preview')}
                        className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'preview' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-zinc-500'}`}
                      >
                        Preview
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-4 font-mono text-sm relative">
                  {activeTab === 'editor' ? (
                    <div className="space-y-1">
                      {output.length === 0 && (
                        <p className="text-zinc-600 italic">Natija bu yerda ko&apos;rinadi...</p>
                      )}
                      {output.map((line, i) => (
                        <div 
                          key={i} 
                          className={line.type === 'error' ? 'text-red-400' : line.type === 'info' ? 'text-indigo-400' : 'text-green-400'}
                        >
                          {line.type === 'log' && <span className="text-zinc-600 mr-2">»</span>}
                          {line.content}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <iframe
                      ref={iframeRef}
                      src={previewUrl}
                      className="w-full h-full bg-white rounded-lg"
                      title="Preview"
                    />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
