const STORAGE_KEYS = {
  LISTS: "anipocket_lists_v1",
  HISTORY: "anipocket_history_v1",
};

export const storage = {
  getLists() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.LISTS)) || {
        watching: [],
        planned: [],
        completed: [],
        dropped: [],
        favorites: []
      };
    } catch {
      return { watching: [], planned: [], completed: [], dropped: [], favorites: [] };
    }
  },

  setLists(lists) {
    try {
      localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(lists));
    } catch (e) {
      console.error("Storage save error", e);
    }
  },

  toggleList(anime, listKey) {
    const lists = this.getLists();
    const existingIndex = (lists[listKey] || []).findIndex(item => item.anime_id === anime.anime_id);
    
    if (existingIndex >= 0) {
      lists[listKey].splice(existingIndex, 1);
    } else {
      // Remove from other mutually exclusive lists if needed
      if (["watching", "planned", "completed", "dropped"].includes(listKey)) {
        ["watching", "planned", "completed", "dropped"].forEach(k => {
          lists[k] = (lists[k] || []).filter(item => item.anime_id !== anime.anime_id);
        });
      }
      if (!lists[listKey]) lists[listKey] = [];
      lists[listKey].unshift({
        anime_id: anime.anime_id,
        anime_url: anime.anime_url,
        title: anime.title,
        poster: anime.poster,
        rating: anime.rating,
        year: anime.year,
        type: anime.type,
        addedAt: Date.now()
      });
    }

    this.setLists(lists);
    return lists;
  },

  getHistory() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY)) || [];
    } catch {
      return [];
    }
  },

  addHistory(anime, episodeNumber, dubbingName) {
    const history = this.getHistory();
    const filtered = history.filter(item => item.anime_id !== anime.anime_id);
    filtered.unshift({
      anime_id: anime.anime_id,
      anime_url: anime.anime_url,
      title: anime.title,
      poster: anime.poster,
      year: anime.year,
      type: anime.type,
      episodeNumber,
      dubbingName,
      watchedAt: Date.now()
    });
    // Keep max 50 items
    const trimmed = filtered.slice(0, 50);
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(trimmed));
    } catch {}
    return trimmed;
  },

  clearHistory() {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch {}
  }
};
