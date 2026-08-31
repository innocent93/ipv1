import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ScrollToTop from './components/Layout/ScrollToTop';
import ErrorBoundary from './components/UI/ErrorBoundary';
import PageLoader from './components/UI/PageLoader';
import ReadingProgressBar from './components/UI/ReadingProgressBar';
import Home from './pages/Home';
import './styles/globals.css';

const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Team = lazy(() => import('./pages/Team'));
const Contact = lazy(() => import('./pages/Contact'));
const ESG = lazy(() => import('./pages/ESG'));
const ProposalRequest = lazy(() => import('./pages/ProposalRequest'));
const Careers = lazy(() => import('./pages/Careers'));
const Events = lazy(() => import('./pages/Events'));
const SearchPage = lazy(() => import('./pages/Search'));
const NotFound = lazy(() => import('./pages/NotFound'));
const NewsletterArchive = lazy(() => import('./pages/NewsletterArchive'));
const TrackApplication = lazy(() => import('./pages/TrackApplication'));
const CompareServices = lazy(() => import('./pages/CompareServices'));

function App() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
  }, []);

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Router>
          <ScrollToTop />
          <ReadingProgressBar />
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <div className="min-h-screen bg-white dark:bg-primary-950 text-gray-900 dark:text-gray-100 font-sans antialiased transition-colors duration-300">
            <Navbar />
            <main id="main-content">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/services/:slug" element={<ServiceDetail />} />
                  <Route path="/services/compare" element={<CompareServices />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/esg" element={<ESG />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/proposal" element={<ProposalRequest />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/careers/track" element={<TrackApplication />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/newsletter" element={<NewsletterArchive />} />
                  <Route path="/cost-engineering" element={<Navigate to="/services/cost-engineering" replace />} />
                  <Route path="/esg-ratings" element={<Navigate to="/services/esg-ratings" replace />} />
                  <Route path="/esg-questionnaire" element={<Navigate to="/esg" replace />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover theme="colored" />
          </div>
        </Router>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
