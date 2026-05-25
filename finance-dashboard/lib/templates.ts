"use client";

import type { Template } from "./types";

const KEY = "fin-dashboard-templates-v1";

export function loadTemplates(): Template[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Template[]) : [];
  } catch {
    return [];
  }
}

export function saveTemplate(t: Template) {
  const list = loadTemplates();
  const idx = list.findIndex((x) => x.id === t.id);
  if (idx >= 0) list[idx] = t;
  else list.push(t);
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function deleteTemplate(id: string) {
  const list = loadTemplates().filter((t) => t.id !== id);
  localStorage.setItem(KEY, JSON.stringify(list));
}
