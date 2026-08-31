import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { api } from '../utils/api';
import SEO from '../components/SEO/SEO';

const statusConfig = {
  submitted: { icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  'under-review': { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  shortlisted: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  interview: { icon: Clock, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/20' },
  rejected: { icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
  hired: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
  withdrawn: { icon: AlertCircle, color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-900/20' },
};

export default function TrackApplication() {
  const [form, setForm] = useState({ referenceNumber: '', email: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await api.trackJobApplication(form);
      setResult(res.data);
    } catch (err) {
      setError(err.message || 'Application not found. Please check your details.');
    } finally { setLoading(false); }
  };

  return (
    <>
      <SEO title="Track Your Application" description="Track the status of your job application at IPMC Nigeria" />
      <div className="pt-24 pb-20 min-h-[70vh]">
        <section className="container-custom max-w-2xl">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-900 dark:text-white mb-4 text-center">Track Your Application</h1>
          <p className="text-gray-600 dark:text-primary-300 mb-8 text-center">Enter your reference number and email to check your application status.</p>

          <form onSubmit={handleSubmit} className="bg-white dark:bg-primary-900 rounded-2xl p-8 border border-gray-100 dark:border-primary-800 shadow-sm">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-primary-300 mb-1">Reference Number</label>
                <input type="text" value={form.referenceNumber} onChange={e => setForm({ ...form, referenceNumber: e.target.value })} placeholder="IPMC-ABC123"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-primary-700 bg-white dark:bg-primary-950 text-primary-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-primary-300 mb-1">Email Address</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-primary-700 bg-white dark:bg-primary-950 text-primary-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent" required />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-accent-500 text-primary-900 font-semibold rounded-xl hover:bg-accent-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />} Track Application
              </button>
            </div>
          </form>

          {error && <div className="mt-6 p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl text-center">{error}</div>}

          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 bg-white dark:bg-primary-900 rounded-2xl p-8 border border-gray-100 dark:border-primary-800">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500 dark:text-primary-400 uppercase tracking-wider">Application Status</p>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mt-2 ${statusConfig[result.status]?.bg || 'bg-gray-50'}`}>
                  {(() => { const Icon = statusConfig[result.status]?.icon || Clock; return <Icon size={18} className={statusConfig[result.status]?.color || 'text-gray-500'} />; })()}
                  <span className={`font-semibold capitalize ${statusConfig[result.status]?.color || 'text-gray-500'}`}>{result.status.replace('-', ' ')}</span>
                </div>
              </div>
              <div className="border-t border-gray-100 dark:border-primary-800 pt-6 space-y-3">
                <div className="flex justify-between"><span className="text-gray-500 dark:text-primary-400">Reference</span><span className="font-mono font-medium text-primary-900 dark:text-white">{result.referenceNumber}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 dark:text-primary-400">Position</span><span className="font-medium text-primary-900 dark:text-white">{result.jobId?.title || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 dark:text-primary-400">Submitted</span><span className="text-primary-900 dark:text-white">{new Date(result.createdAt).toLocaleDateString('en-NG')}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 dark:text-primary-400">Last Updated</span><span className="text-primary-900 dark:text-white">{new Date(result.updatedAt).toLocaleDateString('en-NG')}</span></div>
              </div>
              {result.statusHistory && result.statusHistory.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-primary-800">
                  <h3 className="font-semibold text-primary-900 dark:text-white mb-3">Status History</h3>
                  <div className="space-y-3">
                    {result.statusHistory.map((h, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-accent-500 mt-2" />
                        <div>
                          <p className="text-sm font-medium text-primary-900 dark:text-white capitalize">{h.status.replace('-', ' ')}</p>
                          {h.note && <p className="text-xs text-gray-500 dark:text-primary-400">{h.note}</p>}
                          <p className="text-xs text-gray-400">{new Date(h.updatedAt).toLocaleDateString('en-NG')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </section>
      </div>
    </>
  );
}
