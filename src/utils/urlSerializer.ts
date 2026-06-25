/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AlbumConfig } from "../types";

/**
 * Encodes an AlbumConfig object into a URL-safe Base64 string.
 * Supports full UTF-8 characters (accents, emojis).
 */
export function encodeAlbum(config: AlbumConfig): string {
  try {
    const jsonStr = JSON.stringify(config);
    // Use encodeURIComponent + unescape to preserve UTF-8 characters safely in btoa
    const utf8Str = unescape(encodeURIComponent(jsonStr));
    const base64 = btoa(utf8Str);
    // Make it URL safe by replacing characters
    return base64
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  } catch (error) {
    console.error("Error encoding album config:", error);
    return "";
  }
}

/**
 * Decodes a URL-safe Base64 string back into an AlbumConfig object.
 * Returns null if decoding fails.
 */
export function decodeAlbum(encoded: string): AlbumConfig | null {
  if (!encoded) return null;
  try {
    // Restore standard Base64 characters
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    // Add padding if missing
    while (base64.length % 4) {
      base64 += "=";
    }
    const utf8Str = atob(base64);
    const jsonStr = decodeURIComponent(escape(utf8Str));
    const config = JSON.parse(jsonStr) as AlbumConfig;
    return config;
  } catch (error) {
    console.error("Error decoding album config:", error);
    return null;
  }
}
