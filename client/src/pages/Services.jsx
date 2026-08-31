import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../utils/api';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getServices()
      .then(res => setServices(res.data))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  const categoryColors = {
    'project-management': 'bg-blue-50 text-blue-700 border-blue-200',
    'financial': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'environmental': 'bg-teal-50 text-teal-700 border-teal-200',
    'esg': 'bg-rose-50 text-rose-700 border-rose-200',
    'assurance': 'bg-violet-50 text-violet-700 border-violet-200',
    'fraud': 'bg-amber-50 text-amber-700 border-amber-200',
  };

  return (
    <div className="pt-24">
      <section className="relative py-20 bg-primary-950">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&q=80')] bg-cover bg-center opacity-10" />
        <div className="container-custom relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="text-accent-400 font-semibold text-sm tracking-wider uppercase">Our Services</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mt-4 mb-6">Comprehensive Industry Solutions</h1>
            <p className="text-primary-200 text-lg">End-to-end services designed to meet the unique challenges of Nigeria's oil, gas, and infrastructure sectors.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={40} className="animate-spin text-primary-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.length > 0 ? services.map((service, i) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link to={`/services/${service.slug}`} className="group block">
                    <div className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary-200 h-full">
                      <div className="flex items-start justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${categoryColors[service.category] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                          {service.category.replace('-', ' ').toUpperCase()}
                        </span>
                        <ArrowRight size={20} className="text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                      </div>
                      <h3 className="font-display text-2xl font-bold text-primary-900 mb-3 group-hover:text-primary-600 transition-colors">{service.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{service.shortDescription}</p>
                    </div>
                  </Link>
                </motion.div>
              )) : (
                <div className="col-span-2 text-center py-20 text-gray-500">
                  No services found. Please check back later.
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
