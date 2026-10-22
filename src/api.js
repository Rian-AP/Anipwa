const API_BASE = "https://api.yani.tv";
const TOKEN = "qyzgq0i9ic-9hq3o";

const defaultHeaders = {
  "X-Application": TOKEN,
  "Accept": "application/json, image/avif, image/webp",
  "Lang": "ru",
};

export function fixImageUrl(url) {
  if (!url) return "/icon.png";
  if (url.startsWith("//")) return "https:" + url;
  if (url.startsWith("/")) return API_BASE + url;
  return url;
}

export function formatDuration(seconds) {
  if (!seconds) return "";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours} ч ${minutes} мин`;
  return `${minutes} мин`;
}

export function formatSeason(seasonNum) {
  switch (seasonNum) {
    case 1: return "Зима";
    case 2: return "Весна";
    case 3: return "Лето";
    case 4: return "Осень";
    default: return "";
  }
}

export const api = {
  // Fetch default catalog & genres & types
  async getCatalogData() {
    const res = await fetch(`${API_BASE}/anime/catalog`, { headers: defaultHeaders });
    if (!res.ok) throw new Error("Failed to fetch catalog");
    const json = await res.json();
    return json.response;
  },

  // Search or filter anime list
  async getAnimeList(params = {}) {
    const query = new URLSearchParams();
    if (params.q) query.set("q", params.q);
    if (params.limit) query.set("limit", params.limit);
    if (params.offset) query.set("offset", params.offset);
    if (params.sort) query.set("sort", params.sort);
    if (params.sort_forward !== undefined) query.set("sort_forward", params.sort_forward);
    if (params.genres && params.genres.length) {
      params.genres.forEach(g => query.append("genres[]", g));
    }
    if (params.types && params.types.length) {
      params.types.forEach(t => query.append("types[]", t));
    }
    if (params.status && params.status.length) {
      params.status.forEach(s => query.append("status[]", s));
    }

    const res = await fetch(`${API_BASE}/anime?${query.toString()}`, { headers: defaultHeaders });
    if (!res.ok) throw new Error("Failed to fetch anime list");
    const json = await res.json();
    return json.response || [];
  },

  // Get single anime full details
  async getAnime(idOrUrl) {
    const res = await fetch(`${API_BASE}/anime/${idOrUrl}`, { headers: defaultHeaders });
    if (!res.ok) throw new Error("Failed to fetch anime details");
    const json = await res.json();
    return json.response;
  },

  // Get anime episodes & video players
  async getAnimeVideos(animeId) {
    const res = await fetch(`${API_BASE}/anime/${animeId}/videos`, { headers: defaultHeaders });
    if (!res.ok) throw new Error("Failed to fetch anime videos");
    const json = await res.json();
    return json.response || [];
  },

  // Get schedule of ongoing series
  async getSchedule() {
    const res = await fetch(`${API_BASE}/anime/schedule`, { headers: defaultHeaders });
    if (!res.ok) throw new Error("Failed to fetch schedule");
    const json = await res.json();
    return json.response || [];
  }
};
