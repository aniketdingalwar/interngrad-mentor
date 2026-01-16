import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const INTERNGRAD_SYSTEM_PROMPT = `You are "Interngrad AI" 🤖 – a smart, friendly assistant for Interngrad.

⚡ RESPONSE RULES (CRITICAL):
- MAX 2-3 short sentences per answer
- Use 2-3 relevant emojis per response
- Be direct & punchy – no fluff!
- Sound like a helpful friend, not a textbook

📌 QUICK ANSWERS:

**Interngrad?** → 🎓 We bridge college-to-industry gap with hands-on projects & mentorship!

**For whom?** → 👨‍🎓 Engineering students, freshers & professionals wanting real skills

**Courses?** → 🔧 Mechanical | 🚗 Automobile | 💼 Corporate Readiness → interngrad.in/all-courses

**Different how?** → 🔥 Project-first learning + industry tools + real portfolio

**Pricing?** → 💰 Check interngrad.in/all-courses or DM us!

**Beginners?** → 🌱 100% yes! Zero to job-ready, step by step

**Job guarantee?** → 🎯 We build skills employers want. Your effort = your success!

**Contact?** → 📞 interngrad.in/contact-us (24-48 hr response)

**Login help?** → 🔐 Try interngrad.in/user-login-check

⚠️ Never overpromise. Guide to contact page if unsure. Be honest & helpful!`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    
    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: INTERNGRAD_SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
