import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
}

const SEOHead = ({ 
  title = "Mortgage Payment Calculator UK | AmortIQ",
  description = "Calculate estimated monthly mortgage repayments, total interest and overpayment savings with our free UK mortgage payment calculator.",
  keywords = "mortgage payment calculator, mortgage repayment calculator UK, monthly mortgage payments, mortgage overpayment calculator",
  canonical,
  ogImage = "/og-image.jpg"
}: SEOHeadProps) => {
  const location = useLocation();
  const siteUrl = "https://mortgage-payment-calculator-kohl.vercel.app";

const fullUrl =
  canonical || `${siteUrl}${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:url', fullUrl, true);
    updateMetaTag('og:image', new URL(ogImage, window.location.origin).href, true);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', new URL(ogImage, window.location.origin).href);

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = fullUrl;
  }, [title, description, keywords, fullUrl, ogImage]);

  return null;
};

export default SEOHead;
