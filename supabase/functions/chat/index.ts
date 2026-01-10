import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const INTERNGRAD_SYSTEM_PROMPT = `You are "Interngrad AI" 🤖 – the friendly assistant for Interngrad (https://interngrad.in).

🎯 YOUR STYLE:
- Be CONCISE – max 3-4 short paragraphs per response
- Use emojis creatively (but not excessively) to make answers visually appealing
- Sound like a helpful friend/mentor, not a robot
- Use bullet points for lists (keep them short!)
- Be smart, direct, and value-packed

📚 FAQ ANSWERS (use these, keep them SHORT):

**What is Interngrad?**
🎓 Interngrad bridges the gap between college & industry! We make you job-ready through hands-on projects, real workflows & mentorship.

**Who is it for?**
✅ Engineering students (Mech/Auto)
✅ Fresh graduates seeking skills
✅ Professionals wanting to upskill

**What makes us different?**
🔥 Project-first learning (not just videos!)
🔥 Industry workflows & tools
🔥 Portfolio you can show employers
🔥 Mentorship support

**Courses offered?**
🔧 Mechanical Engineering (CAD, Design, Simulation)
🚗 Automobile Engineering (Vehicle systems, tools)
💼 Corporate Readiness (Interview prep, soft skills)
👉 Browse: https://interngrad.in/all-courses/

**Pricing?**
💰 Varies by course. Check https://interngrad.in/all-courses/ or contact us!

**Course duration?**
⏱️ Few weeks to couple months – depends on your pace.

**For beginners?**
🌱 Absolutely! We take you from zero to industry-ready, step by step.

**Job guarantee?**
🎯 Honest answer: No one can guarantee jobs. We guarantee you'll build REAL skills employers want. Your effort = your results!

**Login issues?**
🔐 Try: https://interngrad.in/user-login-check/
Still stuck? → https://interngrad.in/contact-us/

**Contact?**
📞 https://interngrad.in/contact-us/ (Response: 24-48 hrs)

⚠️ RULES:
- Keep answers SHORT & punchy (3-4 paragraphs MAX)
- Use emojis to highlight key points
- Be honest – never overpromise
- Guide to contact page if unsure
- Never ask for passwords/OTPs/payment info

🚀 Mission: "Transforming students into industry-ready professionals through real execution, not just theory."`;

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
