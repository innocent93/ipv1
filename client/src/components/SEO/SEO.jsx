import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, keywords = '', image = 'https://ipmc-ng.com/og-image.jpg', url = 'https://ipmc-ng.com', type = 'website', canonical, article = null }) {
  const siteName = 'IPMC Nigeria';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDesc = 'Leading project management, financial advisory, and ESG consultancy in Nigeria with 35+ years of excellence.';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: 'https://ipmc-ng.com',
    logo: 'https://ipmc-ng.com/logo512.png',
    description: defaultDesc,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '18B Olu Holloway Road, Ikoyi',
      addressLocality: 'Lagos',
      addressCountry: 'NG',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+234-704-026-9249',
      contactType: 'customer service',
      email: 'enquiries@ipmc-ng.com',
      availableLanguage: ['English'],
    },
    sameAs: [
      'https://linkedin.com/company/ipmc-nigeria',
      'https://twitter.com/ipmc_ng',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: 'https://ipmc-ng.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://ipmc-ng.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: siteName,
    image: 'https://ipmc-ng.com/logo512.png',
    url: 'https://ipmc-ng.com',
    telephone: '+2347040269249',
    email: 'enquiries@ipmc-ng.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '18B Olu Holloway Road, Ikoyi',
      addressLocality: 'Lagos',
      addressCountry: 'NG',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '6.4550',
      longitude: '3.4350',
    },
    openingHours: 'Mo-Fr 08:00-17:00',
    priceRange: '$$$',
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical || url} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_NG" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      <meta name="twitter:image" content={image} />

      {article && (
        <>
          <meta property="article:published_time" content={article.publishedAt} />
          <meta property="article:author" content={article.author} />
          <meta property="article:section" content={article.category} />
        </>
      )}

      <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
    </Helmet>
  );
}
