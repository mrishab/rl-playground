import { create } from "zustand";
import type {
  SavedRLAgent,
  SavedAgentsStore,
} from "@/types/savedAgent";

const STORAGE_KEY = "rl_playground_saved_agents";

function loadFromLocalStorage(): SavedRLAgent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToLocalStorage(agents: SavedRLAgent[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(agents));
  } catch {
    // quota exceeded or disabled
  }
}

export const useSavedAgentsStore = create<SavedAgentsStore>((set, get) => ({
  agents: loadFromLocalStorage(),
  selectedAgent: null,
  searchQuery: "",

  loadAgents: () => {
    set({ agents: loadFromLocalStorage() });
  },

  saveAgent: (agentData) => {
    const now = Date.now();
    const newAgent: SavedRLAgent = {
      ...agentData,
      id: `agent-${now}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };
    const updated = [newAgent, ...get().agents];
    saveToLocalStorage(updated);
    set({ agents: updated });
    return newAgent;
  },

  deleteAgent: (id) => {
    const updated = get().agents.filter((a) => a.id !== id);
    saveToLocalStorage(updated);
    set((s) => ({
      agents: updated,
      selectedAgent: s.selectedAgent?.id === id ? null : s.selectedAgent,
    }));
  },

  renameAgent: (id, newName) => {
    const updated = get().agents.map((a) =>
      a.id === id ? { ...a, name: newName, updatedAt: Date.now() } : a,
    );
    saveToLocalStorage(updated);
    set((s) => ({
      agents: updated,
      selectedAgent:
        s.selectedAgent?.id === id
          ? { ...s.selectedAgent, name: newName, updatedAt: Date.now() }
          : s.selectedAgent,
    }));
  },

  clearAll: () => {
    saveToLocalStorage([]);
    set({ agents: [], selectedAgent: null });
  },

  importAgents: (rawJson) => {
    try {
      const parsed = JSON.parse(rawJson);
      const incoming: SavedRLAgent[] = Array.isArray(parsed) ? parsed : [parsed];
      const valid = incoming.filter((a) => a && typeof a.name === "string" && a.qTable);
      if (valid.length === 0) return 0;
      const current = get().agents;
      const combined = [...valid, ...current];
      saveToLocalStorage(combined);
      set({ agents: combined });
      return valid.length;
    } catch {
      return 0;
    }
  },

  exportAgents: () => {
    return JSON.stringify(get().agents, null, 2);
  },

  setSelectedAgent: (agent) => set({ selectedAgent: agent }),

  setSearchQuery: (query) => set({ searchQuery: query }),
}));
