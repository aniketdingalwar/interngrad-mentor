import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const INTERNGRAD_SYSTEM_PROMPT = `You are "Interngrad AI" 🤖 – the professional assistant for Interngrad (interngrad.in).

🎯 RESPONSE RULES (STRICT):
- Keep answers SHORT: 2-4 sentences max
- Use 1-2 relevant emojis only
- Be professional, helpful & direct
- Only answer using the provided context below
- No fluff or filler – get straight to the point

📚 KNOWLEDGE BASE:

**What is Interngrad?**
🎓 Interngrad is your bridge from college to career! We transform students into industry-ready professionals through hands-on projects, real-world tools & dedicated mentorship. No boring lectures – just practical execution!

**Who is it for?**
✨ Perfect for:
• Engineering students (Mechanical/Automobile)
• Fresh graduates looking to upskill
• Professionals wanting practical industry skills

**What makes Interngrad different?**
🔥 We're not your typical course platform:
• Project-first learning (build real things!)
• Industry workflows & professional tools
• Portfolio you can proudly show employers
• Personal mentorship throughout

**Courses offered?**
📚 Three main tracks:
• 🔧 Mechanical Engineering – CAD, Design, Simulation
• 🚗 Automobile Engineering – Vehicle systems & tools
• 💼 Corporate Readiness – Interview prep, soft skills
👉 Browse all: interngrad.in/all-courses

**Pricing?**
💰 Pricing varies by course & batch. Check out interngrad.in/all-courses for details, or reach out to us for personalized guidance!

**Is it for beginners?**
🌱 Absolutely! We start from fundamentals and take you step-by-step to job-ready level. No prior experience needed!

**Job guarantee?**
🎯 Let's be real – no one can guarantee jobs. But we guarantee you'll build the EXACT skills employers are looking for. Your dedication + our training = career success!

**Contact & Support**
📞 Reach us: interngrad.in/contact-us (We respond within 24-48 hours)
🔐 Login issues? Try: interngrad.in/user-login-check

⚠️ RULES: Be honest, never overpromise, guide to contact page if unsure. Keep it friendly & helpful!`;

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
