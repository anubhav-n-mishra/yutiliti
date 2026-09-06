import React, { useState } from 'react';
import { Share2, Download, RefreshCw, Database, FileJson, FileText, Table } from 'lucide-react';
import { faker } from '@faker-js/faker';

interface FakeDataGeneratorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

type DataType = 'id' | 'name' | 'email' | 'phone' | 'address' | 'jobTitle' | 'company' | 'date';
type ExportFormat = 'json' | 'csv' | 'sql';

interface FieldDef {
  key: DataType;
  label: string;
  checked: boolean;
}

const AVAILABLE_FIELDS: FieldDef[] = [
  { key: 'id', label: 'ID (UUID)', checked: true },
  { key: 'name', label: 'Full Name', checked: true },
  { key: 'email', label: 'Email Address', checked: true },
  { key: 'phone', label: 'Phone Number', checked: false },
  { key: 'address', label: 'Full Address', checked: false },
  { key: 'jobTitle', label: 'Job Title', checked: false },
  { key: 'company', label: 'Company Name', checked: false },
  { key: 'date', label: 'Created At (Date)', checked: false }
];

export default function FakeDataGenerator({ onCopy, onShare }: FakeDataGeneratorProps) {
  const [fields, setFields] = useState<FieldDef[]>(AVAILABLE_FIELDS);
  const [rowCount, setRowCount] = useState<number>(10);
  const [format, setFormat] = useState<ExportFormat>('json');
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<string>('');

  const toggleField = (index: number) => {
    const newFields = [...fields];
    newFields[index].checked = !newFields[index].checked;
    setFields(newFields);
  };

  const generateData = () => {
    const activeFields = fields.filter(f => f.checked);
    if (activeFields.length === 0) return [];
    
    const data = [];
    for (let i = 0; i < rowCount; i++) {
      const row: any = {};
      activeFields.forEach(f => {
        switch (f.key) {
          case 'id': row.id = faker.string.uuid(); break;
          case 'name': row.name = faker.person.fullName(); break;
          case 'email': row.email = faker.internet.email(); break;
          case 'phone': row.phone = faker.phone.number(); break;
          case 'address': row.address = `${faker.location.streetAddress()}, ${faker.location.city()}`; break;
          case 'jobTitle': row.jobTitle = faker.person.jobTitle(); break;
          case 'company': row.company = faker.company.name(); break;
          case 'date': row.date = faker.date.past().toISOString(); break;
        }
      });
      data.push(row);
    }
    return data;
  };

  const formatData = (data: any[]) => {
    if (data.length === 0) return '';
    
    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    } 
    else if (format === 'csv') {
      const keys = Object.keys(data[0]);
      const header = keys.join(',');
      const rows = data.map(row => 
        keys.map(k => {
          let val = row[k] ? row[k].toString() : '';
          if (val.includes(',') || val.includes('"')) {
            val = `"${val.replace(/"/g, '""')}"`;
          }
          return val;
        }).join(',')
      );
      return [header, ...rows].join('\n');
    } 
    else if (format === 'sql') {
      const keys = Object.keys(data[0]);
      const tableName = 'mock_data';
      const insertPrefix = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES\n`;
      const rows = data.map((row, idx) => {
        const values = keys.map(k => {
          let val = row[k];
          if (typeof val === 'string') {
            return `'${val.replace(/'/g, "''")}'`;
          }
          return val;
        }).join(', ');
        return `  (${values})${idx === data.length - 1 ? ';' : ','}`;
      });
      return insertPrefix + rows.join('\n');
    }
    return '';
  };

  const handleGeneratePreview = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const data = generateData();
      const formatted = formatData(data);
      setPreview(formatted);
      setIsProcessing(false);
    }, 100);
  };

  const handleDownload = () => {
    if (!preview) return;
    const blob = new Blob([preview], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mock_data.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h2 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Fake Data Generator</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Generate realistic mock data instantly for testing and development.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onShare("Fake Data Generator", "fake-data-generator")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Settings Pane */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-900 rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-50 font-semibold mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <Database className="w-5 h-5 text-indigo-500" />
              Data Schema
            </div>
            
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Include Fields</label>
                <div className="grid grid-cols-2 gap-3">
                  {fields.map((field, idx) => (
                    <label key={field.key} className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors ${field.checked ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-indigo-300 dark:hover:border-zinc-700'}`}>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={field.checked}
                        onChange={() => toggleField(idx)}
                      />
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${field.checked ? 'bg-indigo-500 border-indigo-500' : 'border-zinc-300 dark:border-zinc-700'}`}>
                        {field.checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className={`text-sm font-semibold ${field.checked ? 'text-indigo-700 dark:text-indigo-400' : 'text-zinc-600 dark:text-zinc-400'}`}>
                        {field.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Row Count</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={rowCount}
                    onChange={(e) => setRowCount(Math.min(1000, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                  />
                  <p className="text-[10px] text-zinc-400">Max 1000 rows</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Export Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as ExportFormat)}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                  >
                    <option value="json">JSON</option>
                    <option value="csv">CSV</option>
                    <option value="sql">SQL INSERT</option>
                  </select>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleGeneratePreview}
              disabled={isProcessing || !fields.some(f => f.checked)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-semibold rounded-xl shadow-lg shadow-zinc-200 dark:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {isProcessing ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Database className="w-5 h-5" />
              )}
              {isProcessing ? 'Generating...' : 'Generate Data'}
            </button>
          </div>
        </div>

        {/* Right Output Dashboard Pane */}
        <div className="lg:col-span-7 flex flex-col bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden h-[600px]">
          
          <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              {format === 'json' && <FileJson className="w-4 h-4 text-amber-500" />}
              {format === 'csv' && <Table className="w-4 h-4 text-emerald-500" />}
              {format === 'sql' && <FileText className="w-4 h-4 text-blue-500" />}
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                mock_data.{format}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onCopy(preview)}
                disabled={!preview}
                className="px-3 py-1.5 text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-md transition-colors disabled:opacity-50"
              >
                Copy
              </button>
              <button
                onClick={handleDownload}
                disabled={!preview}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
          </div>
          
          <div className="flex-grow p-0 overflow-auto bg-[#1e1e1e] relative">
            {!preview ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500">
                <Database className="w-12 h-12 opacity-20 mb-4" />
                <p>Configure schema and generate data to preview here.</p>
              </div>
            ) : (
              <pre className="p-4 text-sm font-mono text-[#d4d4d4] w-full min-w-max">
                {preview}
              </pre>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
