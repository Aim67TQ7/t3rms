
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { package_type } = await req.json();
    
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Create Supabase client using the anon key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get user information if authenticated
    const authHeader = req.headers.get("Authorization");
    let userEmail = "guest@example.com"; // Default for guest checkout
    
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      if (data.user?.email) {
        userEmail = data.user.email;
      }
    }

    // Find or create customer
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    let sessionConfig;
    if (package_type === 'value_pack') {
      // One-time payment for Value Pack
      sessionConfig = {
        customer: customerId,
        customer_email: customerId ? undefined : userEmail,
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Value Pack',
              description: '50 document analyses',
            },
            unit_amount: 995, // $9.95
          },
          quantity: 1,
        }],
        mode: 'payment',
      };
    } else if (package_type === 'unlimited') {
      // Monthly subscription for Unlimited
      sessionConfig = {
        customer: customerId,
        customer_email: customerId ? undefined : userEmail,
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Unlimited Monthly',
              description: 'Unlimited document analyses',
            },
            unit_amount: 2995, // $29.95
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        }],
        mode: 'subscription',
      };
    } else {
      throw new Error('Invalid package type');
    }

    // Add success and cancel URLs
    const origin = req.headers.get("origin") || "http://localhost:3000";
    sessionConfig.success_url = `${origin}/payment-success`;
    sessionConfig.cancel_url = `${origin}/pricing`;

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
