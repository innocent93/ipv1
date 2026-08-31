import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, CheckCircle, Phone, Mail, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { getServiceBySlug } from '../data/servicesData';
import SEO from '../components/SEO/SEO';

export default function ServiceDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    setLoading(true);
    setIsFallback(false);

    api.getService(slug)
      .then(res => {
        if (res) {
          setService(res);
        } else {
          // API returned empty — try fallback
          const fallback = getServiceBySlug(slug);
          if (fallback) {
            setService(fallback);
            setIsFallback(true);
          } else {
            setService(null);
          }
        }
      })
      .catch(() => {
        // API unreachable — use fallback data
        const fallback = getServiceBySlug(slug);
        if (fallback) {
          setService(fallback);
          setIsFallback(true);
        } else {
          setService(null);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="pt-24 flex justify-center py-20 min-h-[60vh]">
      <Loader2 size={40} className="animate-spin text-primary-600" />
    </div>
  );

  if (!service) return (
    <div className="pt-24 container-custom py-20 text-center min-h-[60vh]">
      <SEO title="Service Not Found" />
      <div className="max-w-lg mx-auto">
        <h2 className="text-3xl font-display font-bold text-primary-900 mb-4">Service Not Found</h2>
        <p className="text-gray-600 mb-8">We couldn't find a service matching "{slug}". It may have been moved or renamed.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/services" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">
            <ArrowLeft size={18} />
            Browse All Services
          </Link>
          <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent-500 text-primary-900 font-semibold rounded-lg hover:bg-accent-400 transition-colors">
            <Phone size={18} />
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <SEO
        title={service.metaTitle || service.title}
        description={service.metaDescription || service.shortDescription}
        url={`https://ipmc-ng.com/services/${service.slug}`}
      />
      <div className="pt-20 lg:pt-24">
        {/* Hero */}
        <section className="relative py-20 md:py-28 bg-primary-950 overflow-hidden">
          {service.image && (
            <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${service.image})` }} />
          )}
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
          <div className="container-custom relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-primary-300 hover:text-white transition-colors mb-6 group"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Back
              </button>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-4xl">
                {service.title}
              </h1>
              <p className="text-primary-300 text-lg md:text-xl mt-6 max-w-3xl">
                {service.shortDescription}
              </p>
              {isFallback && (
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-accent-500/10 border border-accent-500/20 rounded-lg">
                  <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" />
                  <span className="text-accent-400 text-sm">Showing offline content — connect to server for live data</span>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="section-padding bg-white">
          <div className="container-custom max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div
                  className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-primary-900 prose-p:text-gray-600 prose-strong:text-primary-900 prose-ul:marker:text-accent-500"
                  dangerouslySetInnerHTML={{ __html: service.fullDescription }}
                />
              </motion.div>

              {/* Sidebar */}
              <motion.aside
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {/* Features */}
                {service.features && service.features.length > 0 && (
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <h3 className="font-display text-lg font-bold text-primary-900 mb-4">Key Features</h3>
                    <ul className="space-y-3">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle size={18} className="text-accent-500 mt-0.5 shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Benefits */}
                {service.benefits && service.benefits.length > 0 && (
                  <div className="bg-primary-950 rounded-2xl p-6">
                    <h3 className="font-display text-lg font-bold text-white mb-4">Benefits</h3>
                    <ul className="space-y-3">
                      {service.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-accent-500/20 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-accent-400 text-xs font-bold">{i + 1}</span>
                          </div>
                          <span className="text-primary-300 text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA */}
                <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl p-6 text-center">
                  <h3 className="font-display text-lg font-bold text-primary-900 mb-2">
                    Need {service.title}?
                  </h3>
                  <p className="text-primary-900/80 text-sm mb-4">
                    Get a tailored proposal for your project.
                  </p>
                  <Link
                    to="/proposal"
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary-900 text-white font-semibold rounded-xl hover:bg-primary-800 transition-colors"
                  >
                    <FileText size={18} />
                    Request a Proposal
                  </Link>
                </div>

                {/* Contact */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-display text-lg font-bold text-primary-900 mb-4">Get in Touch</h3>
                  <div className="space-y-3">
                    <a href="tel:+2347040269249" className="flex items-center gap-3 text-gray-700 hover:text-primary-600 transition-colors">
                      <Phone size={18} className="text-accent-500" />
                      <span className="text-sm">+234 704 026 9249</span>
                    </a>
                    <a href="mailto:enquiries@ipmc-ng.com" className="flex items-center gap-3 text-gray-700 hover:text-primary-600 transition-colors">
                      <Mail size={18} className="text-accent-500" />
                      <span className="text-sm">enquiries@ipmc-ng.com</span>
                    </a>
                  </div>
                </div>
              </motion.aside>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
