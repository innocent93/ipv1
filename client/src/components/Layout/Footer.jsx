import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, ArrowRight, Linkedin, Twitter } from 'lucide-react';

const services = [
  { name: 'Project Administration', path: '/services/project-administration' },
  { name: 'Cost Engineering', path: '/services/cost-engineering' },
  { name: 'Value for Money Audit', path: '/services/value-for-money-audit' },
  { name: 'Forensic Audit', path: '/services/forensic-audit' },
  { name: 'Assurance Services', path: '/services/assurance-services' },
  { name: 'Financial Advisory', path: '/services/financial-advisory' },
  { name: 'QA/QC (Third Party Inspection)', path: '/services/qa-qc' },
  { name: 'ESG Ratings & Rankings', path: '/services/esg-ratings' },
  { name: 'ESG Consulting & Reporting', path: '/services/esg-consulting' },
  { name: 'Manpower Supply Services', path: '/services/manpower-supply' },
  { name: 'Environmental Services', path: '/services/environmental' },
  { name: 'Asset Integrity', path: '/services/asset-integrity' },
];

const quickLinks = [
  { name: 'About IPMC', path: '/about' },
  { name: 'Our Capabilities', path: '/services' },
  { name: 'Compare Services', path: '/services/compare' },
  { name: 'Research & Insights', path: '/blog' },
  { name: 'ESG Solutions', path: '/esg' },
  { name: 'Careers', path: '/careers' },
  { name: 'Track Application', path: '/careers/track' },
  { name: 'Events', path: '/events' },
  { name: 'Newsletter', path: '/newsletter' },
  { name: 'Proposal Request', path: '/proposal' },
  { name: 'Contact Us', path: '/contact' },
];

export default function Footer() {
  return (
    <footer className="bg-primary-950 border-t border-white/10">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="font-display text-xl font-bold text-white mb-4">IPMC Nigeria</h3>
            <p className="text-primary-300 text-sm leading-relaxed mb-6">
              Leading project monitoring, financial advisory, and ESG consultancy in Nigeria with 35+ years of excellence.
            </p>
            <div className="flex gap-3">
              <a href="https://linkedin.com/company/ipmc-nigeria" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-lg text-primary-300 hover:text-white hover:bg-white/10 transition-colors"><Linkedin size={18} /></a>
              <a href="https://twitter.com/ipmc_ng" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-lg text-primary-300 hover:text-white hover:bg-white/10 transition-colors"><Twitter size={18} /></a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <h4 className="font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2">
              {services.map(s => (
                <li key={s.path}><Link to={s.path} className="text-primary-300 text-sm hover:text-accent-400 transition-colors flex items-center gap-1 group"><ArrowRight size={12} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />{s.name}</Link></li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map(l => (
                <li key={l.path}><Link to={l.path} className="text-primary-300 text-sm hover:text-accent-400 transition-colors flex items-center gap-1 group"><ArrowRight size={12} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />{l.name}</Link></li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3"><Phone size={16} className="text-accent-500 mt-1 shrink-0" /><span className="text-primary-300 text-sm">+234 704 026 9249<br/>+234 704 577 9160</span></li>
              <li className="flex items-start gap-3"><Mail size={16} className="text-accent-500 mt-1 shrink-0" /><a href="mailto:enquiries@ipmc-ng.com" className="text-primary-300 text-sm hover:text-accent-400">enquiries@ipmc-ng.com</a></li>
              <li className="flex items-start gap-3"><MapPin size={16} className="text-accent-500 mt-1 shrink-0" /><span className="text-primary-300 text-sm">18B Olu Holloway Road<br/>Ikoyi, Lagos, Nigeria</span></li>
            </ul>
          </motion.div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-500 text-sm">&copy; {new Date().getFullYear()} IPMC Nigeria. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-primary-500 text-sm hover:text-accent-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-primary-500 text-sm hover:text-accent-400 transition-colors">Terms of Service</Link>
            <Link to="/sitemap" className="text-primary-500 text-sm hover:text-accent-400 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
