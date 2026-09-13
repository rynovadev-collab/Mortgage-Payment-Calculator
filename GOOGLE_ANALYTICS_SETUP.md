# Google Analytics Setup Instructions

Google Analytics has been integrated into your AmortIQ application! Follow these steps to complete the setup:

## Step 1: Create a Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click "Start measuring" or "Admin" (gear icon)
4. Create a new account or select an existing one

## Step 2: Create a GA4 Property

1. In Admin, click "+ Create Property"
2. Enter property details:
   - **Property name**: AmortIQ
   - **Reporting time zone**: United Kingdom
   - **Currency**: Pound Sterling (£)
3. Click "Next"
4. Fill in business details and click "Create"
5. Accept the Terms of Service

## Step 3: Set Up Data Stream

1. Select "Web" as the platform
2. Enter your website details:
   - **Website URL**: https://amortiq.co.uk (or your domain)
   - **Stream name**: AmortIQ Website
3. Click "Create stream"

## Step 4: Get Your Measurement ID

1. You'll see your **Measurement ID** (format: `G-XXXXXXXXXX`)
2. Copy this ID

## Step 5: Add Your Measurement ID to the Code

1. Open the file: `src/hooks/useGoogleAnalytics.ts`
2. Find this line near the top:
   ```typescript
   const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // TODO: Replace with your GA4 Measurement ID
   ```
3. Replace `'G-XXXXXXXXXX'` with your actual Measurement ID:
   ```typescript
   const GA_MEASUREMENT_ID = 'G-ABC123DEF4'; // Your actual ID
   ```
4. Save the file

## Step 6: Verify It's Working

1. After deploying your changes, visit your website
2. Go back to Google Analytics
3. Navigate to: **Reports** → **Realtime**
4. You should see your visit being tracked in real-time!

## What Gets Tracked

Your site now automatically tracks:
- **Page views**: Every page visit across your site
- **User sessions**: Complete user journeys
- **Traffic sources**: Where visitors come from
- **Device types**: Mobile, desktop, tablet
- **Demographics**: Location, language, interests (when available)
- **User behavior**: Time on page, bounce rate, conversions

## Custom Event Tracking

You can also track custom events using the `trackEvent` function:

```typescript
import { trackEvent } from '@/hooks/useGoogleAnalytics';

// Example: Track button clicks
trackEvent('button_click', {
  button_name: 'calculate_mortgage',
  page: '/dashboard'
});

// Example: Track form submissions
trackEvent('form_submit', {
  form_name: 'contact_form',
  form_location: '/contact'
});
```

## Useful Google Analytics Reports

Once data starts flowing, check these reports:

1. **Realtime Overview**: See who's on your site right now
2. **Acquisition Overview**: Where your traffic comes from
3. **Engagement Overview**: What pages users visit
4. **Retention**: How many users return
5. **User Attributes**: Demographics and interests

## Privacy Compliance

Google Analytics is configured to be GDPR-friendly:
- IP anonymization is enabled by default in GA4
- Consider adding a cookie consent banner if needed
- Update your Privacy Policy to mention Google Analytics

## Need Help?

- [GA4 Documentation](https://support.google.com/analytics/answer/10089681)
- [GA4 Setup Guide](https://support.google.com/analytics/answer/9304153)

---

**Important**: Make sure to update your Privacy Policy to mention that you use Google Analytics for tracking website usage!
