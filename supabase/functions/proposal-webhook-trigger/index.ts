import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const payload = await req.json();
    
    const { type, table, record } = payload;
    
    if (type !== 'INSERT' && type !== 'UPDATE') {
      return new Response(
        JSON.stringify({ error: 'Invalid event type' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    if (table !== 'proposals') {
      return new Response(
        JSON.stringify({ error: 'Invalid table' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    if (record.status === 'queued' && record.votes_for >= 10) {
      const backendWebhookUrl = Deno.env.get('BACKEND_WEBHOOK_URL') || 'http://localhost:3001/webhook/proposal';
      
      const webhookResponse = await fetch(backendWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proposal_id: record.id,
          title: record.title,
          summary: record.summary,
        }),
      });
      
      if (!webhookResponse.ok) {
        console.error('Failed to trigger backend webhook:', await webhookResponse.text());
        return new Response(
          JSON.stringify({ error: 'Failed to trigger backend' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      return new Response(
        JSON.stringify({ success: true, triggered: true }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true, triggered: false, reason: 'Not enough votes or wrong status' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});