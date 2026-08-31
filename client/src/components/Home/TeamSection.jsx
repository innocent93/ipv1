import { motion } from 'framer-motion';
import { Linkedin, Twitter, Mail } from 'lucide-react';

// Real IPMC leadership, sourced from ipmc-ng.com/about
const team = [
  {
    name: 'Robert Ade-Odiachi, FCA',
    role: 'Chief Executive Officer',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
    bio: 'Leads IPMC with three decades of experience across finance, engineering and project consulting.',
  },
  {
    name: 'Adebayo Ajao, MSc Economics',
    role: 'Head of Research',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    bio: 'Directs research and economic analysis behind IPMC\u2019s advisory and ESG work.',
  },
  {
    name: 'Chika Onyekwere, B.Eng',
    role: 'Environmental Consultant',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    bio: 'Leads environmental impact assessments and compliance across client projects.',
  },
  {
    name: 'Agatha Afemike, BSc, ACA, GRI',
    role: 'ESG Consultant',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    bio: 'Guides clients through ESG assessment, ratings and sustainability reporting.',
  },
];

export default function TeamSection() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-primary-600 font-semibold text-sm tracking-wider uppercase">Our Leadership</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-900 mt-3 mb-6">
            Meet the Experts Behind Our Success
          </h2>
          <p className="text-gray-600 text-lg">
            A diverse team of seasoned professionals committed to delivering excellence in every project.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                {/* Image */}
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Social Links */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    {[Linkedin, Twitter, Mail].map((Icon, i) => (
                      <button key={i} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-accent-400 hover:text-primary-900 transition-colors">
                        <Icon size={18} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="font-display text-lg font-bold text-primary-900">{member.name}</h3>
                  <p className="text-primary-600 text-sm font-medium mb-2">{member.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
