# SEO deployment checklist

1. Deploy to Vercel and confirm the final `https://...vercel.app` URL.
2. The homepage canonical and Open Graph URL are set at runtime from `window.location.origin` by `SEOHead`. Confirm them in browser DevTools after page loads.
3. Create `public/sitemap.xml` with the final Vercel hostname, including `/` and `/guides/mortgage-overpayment-beginners-guide`, then redeploy. The previous sitemap was removed because it referenced the old deployment.
4. Verify the new URL property in Google Search Console and submit the new sitemap.
5. Note: Vite is a client-rendered SPA. For stronger crawler reliability, consider prerendering the homepage and guide in a later iteration.
6. Review any old Search Console verification code and add the new property verification method if needed.
7. Check the social image: `SEOHead` currently uses `/og-image.jpg`; provide that file or change the path.
