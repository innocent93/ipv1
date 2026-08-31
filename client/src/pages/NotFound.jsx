import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, Phone, Mail, MapPin, FileText, Wrench, Users, Shield, Leaf, BarChart3, AlertTriangle, CheckCircle, TrendingUp, Globe, TreePine } from 'lucide-react';
import SEO from '../components/SEO/SEO';

const suggestedPages = [
  { name: 'Home', path: '/', icon: Home, desc: 'Return to our homepage' },
  { name: 'About IPMC', path: '/about', icon: FileText, desc: 'Learn about our 35+ years of excellence' },
  { name: 'Our Services', path: '/services', icon: Wrench, desc: 'Explore our comprehensive capabilities' },
  { name: 'Project Administration', path: '/services/project-administration', icon: BarChart3, desc: 'End-to-end project oversight' },
  { name: 'Financial Advisory', path: '/services/financial-advisory', icon: TrendingUp, desc: 'Strategic financial guidance' },
  { name: 'ESG Consulting', path: '/services/esg-consulting', icon: Leaf, desc: 'Sustainability & ESG solutions' },
  { name: 'Assurance Services', path: '/services/assurance-services', icon: Shield, desc: 'Independent project assurance' },
  { name: 'QA/QC Inspection', path: '/services/qa-qc', icon: CheckCircle, desc: 'Third-party quality inspection' },
  { name: 'Team', path: '/team', icon: Users, desc: 'Meet our leadership' },
  { name: 'Blog & Insights', path: '/blog', icon: FileText, desc: 'Latest industry insights' },
  { name: 'ESG Resources', path: '/esg', icon: Globe, desc: 'ESG assessments & ratings' },
  { name: 'Careers', path: '/careers', icon: Users, desc: 'Join our team' },
  { name: 'Contact Us', path: '/contact', icon: Phone, desc: 'Get in touch' },
  { name: 'Request a Proposal', path: '/proposal', icon: FileText, desc: 'Start your project with us' },
];

const popularSearches = [
  'project monitoring', 'ESG consulting', 'financial audit', 'quality inspection',
  'cost engineering', 'forensic audit', 'manpower supply', 'asset integrity',
  'environmental services', 'NUPRC compliance', 'NESREA', 'SDG alignment',
];

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const filteredPages = searchQuery.trim().length > 0
    ? suggestedPages.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : suggestedPages;

  return (
    <>
      <SEO
        title="Page Not Found"
        description="The page you are looking for does not exist. Explore IPMC Nigeria's services in project monitoring, ESG consulting, financial advisory, and more."
        url="https://ipmc-ng.com/404"
      />
      <div className="min-h-screen bg-primary-950">
        {/* Hero 404 Section */}
        <section className="relative pt-32 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80')] bg-cover bg-center opacity-5" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />

          <div className="container-custom relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              {/* 404 Display */}
              <div className="relative inline-block mb-8">
                <span className="text-[8rem] md:text-[12rem] font-display font-bold text-accent-500/20 leading-none select-none">
                  404
                </span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl md:text-8xl font-display font-bold text-accent-500">
                    404
                  </span>
                </div>
              </div>

              <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
                Page Not Found
              </h1>
              <p className="text-primary-300 text-lg md:text-xl mb-8 max-w-xl mx-auto">
                The page you're looking for doesn't exist or has been moved.
                Let's get you back on track.
              </p>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-500 text-primary-900 font-semibold rounded-xl hover:bg-accent-400 transition-all duration-300 shadow-lg shadow-accent-500/20"
                >
                  <Home size={20} />
                  Back to Home
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  <Wrench size={20} />
                  Explore Services
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10"
                >
                  <Phone size={20} />
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Search Section */}
        <section className="pb-16">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" size={22} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search our site for what you need..."
                  className="w-full pl-12 pr-32 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-primary-400 focus:outline-none focus:border-accent-500/50 focus:ring-2 focus:ring-accent-500/20 transition-all"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-accent-500 text-primary-900 font-semibold rounded-lg hover:bg-accent-400 transition-colors"
                >
                  Search
                </button>
              </form>

              {/* Popular Searches */}
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <span className="text-primary-400 text-sm">Popular:</span>
                {popularSearches.map(term => (
                  <button
                    key={term}
                    onClick={() => { setSearchQuery(term); navigate(`/search?q=${encodeURIComponent(term)}`); }}
                    className="text-sm text-accent-400 hover:text-accent-300 transition-colors underline underline-offset-2"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Suggested Pages Grid */}
        <section className="pb-20">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white text-center mb-10">
                You might be looking for
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {filteredPages.map((page, i) => {
                  const Icon = page.icon;
                  return (
                    <motion.div
                      key={page.path}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i, duration: 0.4 }}
                    >
                      <Link
                        to={page.path}
                        className="group flex items-start gap-4 p-5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-accent-500/30 transition-all duration-300"
                      >
                        <div className="p-3 bg-accent-500/10 rounded-lg group-hover:bg-accent-500/20 transition-colors shrink-0">
                          <Icon size={22} className="text-accent-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white group-hover:text-accent-400 transition-colors">
                            {page.name}
                          </h3>
                          <p className="text-primary-400 text-sm mt-1">{page.desc}</p>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {filteredPages.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-primary-400">No pages match your search. Try a different term or <Link to="/contact" className="text-accent-400 hover:underline">contact us</Link> directly.</p>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="pb-20">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="max-w-4xl mx-auto bg-gradient-to-br from-primary-900/80 to-primary-950/80 border border-white/10 rounded-2xl p-8 md:p-12"
            >
              <div className="text-center mb-8">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
                  Need help finding something?
                </h2>
                <p className="text-primary-300 max-w-xl mx-auto">
                  Our team is available to assist you. Reach out and we'll point you in the right direction.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <a
                  href="tel:+2347040269249"
                  className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/10"
                >
                  <Phone size={20} className="text-accent-400" />
                  <div>
                    <p className="text-xs text-primary-400 uppercase tracking-wider">Call Us</p>
                    <p className="text-white font-medium">+234 704 026 9249</p>
                  </div>
                </a>
                <a
                  href="mailto:enquiries@ipmc-ng.com"
                  className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/10"
                >
                  <Mail size={20} className="text-accent-400" />
                  <div>
                    <p className="text-xs text-primary-400 uppercase tracking-wider">Email Us</p>
                    <p className="text-white font-medium">enquiries@ipmc-ng.com</p>
                  </div>
                </a>
                <Link
                  to="/contact"
                  className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/10"
                >
                  <MapPin size={20} className="text-accent-400" />
                  <div>
                    <p className="text-xs text-primary-400 uppercase tracking-wider">Visit Us</p>
                    <p className="text-white font-medium">18B Olu Holloway Rd, Ikoyi</p>
                  </div>
                </Link>
              </div>

              <div className="mt-8 text-center">
                <Link
                  to="/proposal"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-accent-500 text-primary-900 font-semibold rounded-xl hover:bg-accent-400 transition-colors"
                >
                  <FileText size={18} />
                  Request a Proposal
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer hint */}
        <div className="border-t border-white/10 py-8">
          <div className="container-custom text-center">
            <p className="text-primary-500 text-sm">
              IPMC Nigeria — Independent Project Monitoring Company · 35+ Years of Excellence
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
