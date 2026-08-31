import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Check, ArrowRight } from 'lucide-react';
import { getAllServices } from '../data/servicesData';
import SEO from '../components/SEO/SEO';

export default function CompareServices() {
  const [selected, setSelected] = useState([]);
  const services = getAllServices();
  const compared = services.filter(s => selected.includes(s.slug));

  const toggleService = (slug) => {
    setSelected(prev => {
      if (prev.includes(slug)) return prev.filter(s => s !== slug);
      if (prev.length >= 3) return prev;
      return [...prev, slug];
    });
  };

  return (
    <>
      <SEO title="Compare Services" description="Compare IPMC services side by side" />
      <div className="pt-24 pb-20">
        <section className="container-custom">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-900 dark:text-white mb-4">Compare Services</h1>
          <p className="text-gray-600 dark:text-primary-300 mb-8">Select up to 3 services to compare side by side.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
            {services.map(s => (
              <button key={s.slug} onClick={() => toggleService(s.slug)}
                className={`p-4 rounded-xl border text-left transition-all ${selected.includes(s.slug) ? 'border-accent-500 bg-accent-500/10' : 'border-gray-200 dark:border-primary-700 hover:border-accent-500/30'} ${selected.length >= 3 && !selected.includes(s.slug) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <span className="font-medium text-sm text-primary-900 dark:text-white">{s.title}</span>
              </button>
            ))}
          </div>

          {compared.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-4 border-b border-gray-200 dark:border-primary-700 font-medium text-gray-500 dark:text-primary-400">Feature</th>
                    {compared.map(s => (
                      <th key={s.slug} className="text-left p-4 border-b border-gray-200 dark:border-primary-700 min-w-[200px]">
                        <Link to={`/services/${s.slug}`} className="font-display font-bold text-primary-900 dark:text-white hover:text-accent-500">{s.title}</Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-4 border-b border-gray-100 dark:border-primary-800 text-gray-600 dark:text-primary-300">Description</td>
                    {compared.map(s => <td key={s.slug} className="p-4 border-b border-gray-100 dark:border-primary-800 text-sm text-gray-700 dark:text-primary-200">{s.shortDescription}</td>)}
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-gray-100 dark:border-primary-800 text-gray-600 dark:text-primary-300">Category</td>
                    {compared.map(s => <td key={s.slug} className="p-4 border-b border-gray-100 dark:border-primary-800 text-sm capitalize">{s.category}</td>)}
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-gray-100 dark:border-primary-800 text-gray-600 dark:text-primary-300">Key Features</td>
                    {compared.map(s => (
                      <td key={s.slug} className="p-4 border-b border-gray-100 dark:border-primary-800">
                        <ul className="space-y-1">
                          {s.features.slice(0, 4).map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-primary-200"><Check size={14} className="text-accent-500" /> {f}</li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 text-gray-600 dark:text-primary-300"></td>
                    {compared.map(s => (
                      <td key={s.slug} className="p-4">
                        <Link to={`/services/${s.slug}`} className="inline-flex items-center gap-2 text-accent-500 hover:text-accent-600 font-medium text-sm">View Details <ArrowRight size={16} /></Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </motion.div>
          )}
        </section>
      </div>
    </>
  );
}
