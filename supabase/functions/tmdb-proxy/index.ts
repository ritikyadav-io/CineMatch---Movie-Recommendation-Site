import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TMDB_API_KEY = Deno.env.get("TMDB_API_KEY") || "2dca580c2a14b55200e784d157207b4d";
const TMDB_BASE = "https://api.themoviedb.org/3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { endpoint, params, detail } = await req.json();

    // Full detail mode: fetch movie + credits + watch providers + release dates in parallel
    if (detail && endpoint) {
      const base = `${TMDB_BASE}${endpoint}`;
      const key = `api_key=${TMDB_API_KEY}`;
      
      const [movieRes, creditsRes, providersRes, releaseDatesRes, videosRes] = await Promise.all([
        fetch(`${base}?${key}`),
        fetch(`${base}/credits?${key}`),
        fetch(`${base}/watch/providers?${key}`),
        fetch(`${base}/release_dates?${key}`),
        fetch(`${base}/videos?${key}`),
      ]);

      const [movie, credits, providers, releaseDates, videos] = await Promise.all([
        movieRes.json(),
        creditsRes.json(),
        providersRes.json(),
        releaseDatesRes.json(),
        videosRes.json(),
      ]);

      // Extract certification from US or IN release dates
      let certification = "";
      const rdResults = releaseDates?.results || [];
      const usRelease = rdResults.find((r: any) => r.iso_3166_1 === "US");
      const inRelease = rdResults.find((r: any) => r.iso_3166_1 === "IN");
      const releaseEntry = usRelease || inRelease || rdResults[0];
      if (releaseEntry?.release_dates?.length) {
        certification = releaseEntry.release_dates.find((d: any) => d.certification)?.certification || "";
      }

      // Get watch providers for US and IN
      const watchProviders = providers?.results || {};
      const usProviders = watchProviders["US"] || {};
      const inProviders = watchProviders["IN"] || {};

      const result = {
        ...movie,
        cast: (credits?.cast || []).slice(0, 12).map((c: any) => ({
          id: c.id,
          name: c.name,
          character: c.character,
          profile_path: c.profile_path,
        })),
        director: (credits?.crew || []).find((c: any) => c.job === "Director")?.name || null,
        watch_providers_us: usProviders,
        watch_providers_in: inProviders,
        certification,
        trailer: (videos?.results || []).find(
          (v: any) => v.type === "Trailer" && v.site === "YouTube"
        )?.key || null,
      };

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=3600, s-maxage=7200" },
      });
    }

    // Standard proxy mode
    if (!endpoint) {
      return new Response(JSON.stringify({ error: "Missing endpoint" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const search = new URLSearchParams({ api_key: TMDB_API_KEY, ...params });
    const url = `${TMDB_BASE}${endpoint}?${search.toString()}`;
    const tmdbRes = await fetch(url);
    const data = await tmdbRes.json();

    return new Response(JSON.stringify(data), {
      status: tmdbRes.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
