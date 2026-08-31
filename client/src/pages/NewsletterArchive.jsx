import { motion } from 'framer-motion';
import { Calendar, Mail, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO/SEO';

const ARCHIVE = [
  { id: 1, title: 'Q1 2026 ESG Market Update', date: '2026-03-15', excerpt: 'Key developments in Nigerian ESG regulation and what they mean for your business.' },
  { id: 2, title: 'Project Monitoring Best Practices', date: '2026-02-20', excerpt: 'How leading energy companies are reducing project overruns by 40%.' },
  { id: 3, title: 'IPMC Annual Review 2025', date: '2025-12-10', excerpt: 'A year of growth, new partnerships, and expanded capabilities across Nigeria.' },
  { id: 4, title: 'NUPRC Compliance Changes', date: '2025-11-05', excerpt: 'Understanding the new environmental compliance requirements for upstream operators.' },
  { id: 5, title: 'Cost Engineering in Volatile Markets', date: '2025-09-18', excerpt: 'Strategies for maintaining project viability amid currency and commodity fluctuations.' },
];

export default function NewsletterArchive() {
  return (
    <>
      <SEO title="Newsletter Archive" description="Past newsletters from IPMC Nigeria" />
      <div className="pt-24 pb-20">
        <section className="container-custom max-w-4xl">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-900 dark:text-white mb-4">Newsletter Archive</h1>
          <p className="text-gray-600 dark:text-primary-300 mb-12">Browse past editions of our industry insights and company updates.</p>
          <div className="space-y-6">
            {ARCHIVE.map((item, i) => (
              <motion.article key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-primary-900 rounded-2xl p-6 border border-gray-100 dark:border-primary-800 hover:border-accent-500/30 transition-all">
                <div className="flex items-center gap-2 text-sm text-accent-500 mb-2">
                  <Calendar size={14} />
                  <span>{new Date(item.date).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <h2 className="font-display text-xl font-bold text-primary-900 dark:text-white mb-2">{item.title}</h2>
                <p className="text-gray-600 dark:text-primary-300 mb-4">{item.excerpt}</p>
                <button className="inline-flex items-center gap-2 text-accent-500 hover:text-accent-600 font-medium text-sm">
                  <Mail size={16} /> Read in Browser <ArrowRight size={14} />
                </button>
              </motion.article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
