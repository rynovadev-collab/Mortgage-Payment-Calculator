import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching Bank of England base rate...');
    
    // Fetch the official Bank Rate page
    const pageUrl = 'https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp';
    
    const response = await fetch(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      }
    });

    if (!response.ok) {
      console.error('Bank of England page error:', response.status);
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    console.log('Received HTML page from Bank of England');

    // Extract the current rate from the HTML
    // The page contains: "Current official Bank Rate\n\n4%"
    const rateMatch = html.match(/Current official Bank Rate[^0-9]*(\d+\.?\d*)/i);
    
    if (!rateMatch || !rateMatch[1]) {
      console.error('Could not find rate in page HTML');
      console.log('HTML sample:', html.substring(0, 500));
      throw new Error('Could not extract rate from page');
    }

    const latestRate = parseFloat(rateMatch[1]);
    console.log(`Successfully extracted rate: ${latestRate}%`);

    // Get the current date as the rate date
    const latestDate = new Date().toISOString().split('T')[0];

    // For change calculation, we'd need historical data
    // Defaulting to 0 for now
    const change = 0;

    return new Response(
      JSON.stringify({
        rate: latestRate,
        date: latestDate,
        change: change,
        source: 'Bank of England'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in fetch-base-rate function:', error);
    
    // Return fallback data on error
    return new Response(
      JSON.stringify({
        rate: 4.0,
        date: new Date().toISOString().split('T')[0],
        change: 0,
        source: 'Fallback',
        error: 'Could not fetch live data'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  }
});
