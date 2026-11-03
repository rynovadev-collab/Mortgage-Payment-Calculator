import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface StructuredDataProps {
  breadcrumbs?: BreadcrumbItem[];
  pageType?: 'WebPage' | 'AboutPage' | 'ContactPage' | 'FAQPage' | 'CollectionPage';
  headline?: string;
}

const StructuredData = ({ breadcrumbs, pageType = 'WebPage', headline }: StructuredDataProps) => {
  const location = useLocation();

  useEffect(() => {
    // Remove any existing structured data scripts added by this component
    const existingScripts = document.querySelectorAll('script[data-structured-data="page"]');
    existingScripts.forEach(script => script.remove());

    const currentUrl = `${window.location.origin}${location.pathname}`;

    // Create breadcrumb structured data if breadcrumbs are provided
    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": crumb.name,
          "item": crumb.url
        }))
      };

      const breadcrumbScript = document.createElement('script');
      breadcrumbScript.type = 'application/ld+json';
      breadcrumbScript.setAttribute('data-structured-data', 'page');
      breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);
      document.head.appendChild(breadcrumbScript);
    }

    // Create page-specific structured data
    const pageSchema: any = {
      "@context": "https://schema.org",
      "@type": pageType,
      "url": currentUrl,
      "name": headline || document.title,
      "isPartOf": {
        "@type": "WebSite",
        "url": window.location.origin
      }
    };

    if (headline) {
      pageSchema.headline = headline;
    }

    const pageScript = document.createElement('script');
    pageScript.type = 'application/ld+json';
    pageScript.setAttribute('data-structured-data', 'page');
    pageScript.textContent = JSON.stringify(pageSchema);
    document.head.appendChild(pageScript);

    return () => {
      // Cleanup on unmount
      const scripts = document.querySelectorAll('script[data-structured-data="page"]');
      scripts.forEach(script => script.remove());
    };
  }, [location.pathname, breadcrumbs, pageType, headline]);

  return null;
};

export default StructuredData;
