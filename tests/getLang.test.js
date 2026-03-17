/**
 * Tests for getLang() - browser language detection for first-time visitors.
 *
 * getLang() logic:
 *   1. If localStorage has 'libia-lang', return it (returning visitor).
 *   2. Otherwise, detect from navigator.language and map to one of:
 *      en, es, zh, hi, ar, de — defaulting to 'pt'.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// ---------------------------------------------------------------------------
// Minimal browser-global stubs
// ---------------------------------------------------------------------------

class FakeStorage {
  constructor() { this._data = {}; }
  getItem(k)      { return Object.prototype.hasOwnProperty.call(this._data, k) ? this._data[k] : null; }
  setItem(k, v)   { this._data[k] = String(v); }
  removeItem(k)   { delete this._data[k]; }
  clear()         { this._data = {}; }
}

// Replace global localStorage with our fake
global.localStorage = new FakeStorage();

// We'll override navigator.language via a getter on the global object.
let _navigatorLanguage = 'pt';
Object.defineProperty(global, 'navigator', {
  get: () => ({ language: _navigatorLanguage }),
  configurable: true,
});

// ---------------------------------------------------------------------------
// Import the function under test
// We inline it here to avoid loading the full script.js (which requires DOM).
// The implementation is a verbatim copy of getLang() from script.js line 913.
// ---------------------------------------------------------------------------

function getLang() {
  try {
    const saved = localStorage.getItem('libia-lang');
    if (saved) return saved;
    const bl = (navigator.language || 'pt').toLowerCase();
    return bl.startsWith('en') ? 'en' :
           (bl.startsWith('es') ? 'es' :
           (bl.startsWith('zh') ? 'zh' :
           (bl.startsWith('hi') ? 'hi' :
           (bl.startsWith('ar') ? 'ar' :
           (bl.startsWith('de') ? 'de' : 'pt')))));
  } catch (e) { return 'pt'; }
}

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function withBrowserLang(lang, fn) {
  _navigatorLanguage = lang;
  localStorage.clear();
  return fn();
}

function withSavedLang(savedLang, browserLang, fn) {
  _navigatorLanguage = browserLang;
  localStorage.clear();
  localStorage.setItem('libia-lang', savedLang);
  return fn();
}

// ---------------------------------------------------------------------------
// Tests: first-time visitor (no localStorage)
// ---------------------------------------------------------------------------

describe('getLang() — first-time visitor (no saved preference)', () => {

  test('English browser (en-US) → "en"', () => {
    assert.equal(withBrowserLang('en-US', getLang), 'en');
  });

  test('English browser (en-GB) → "en"', () => {
    assert.equal(withBrowserLang('en-GB', getLang), 'en');
  });

  test('English browser (en) → "en"', () => {
    assert.equal(withBrowserLang('en', getLang), 'en');
  });

  test('Spanish browser (es-ES) → "es"', () => {
    assert.equal(withBrowserLang('es-ES', getLang), 'es');
  });

  test('Spanish browser (es-MX) → "es"', () => {
    assert.equal(withBrowserLang('es-MX', getLang), 'es');
  });

  test('Spanish browser (es) → "es"', () => {
    assert.equal(withBrowserLang('es', getLang), 'es');
  });

  test('Mandarin browser (zh-CN) → "zh"', () => {
    assert.equal(withBrowserLang('zh-CN', getLang), 'zh');
  });

  test('Mandarin browser (zh-TW) → "zh"', () => {
    assert.equal(withBrowserLang('zh-TW', getLang), 'zh');
  });

  test('Mandarin browser (zh) → "zh"', () => {
    assert.equal(withBrowserLang('zh', getLang), 'zh');
  });

  test('Hindi browser (hi-IN) → "hi"', () => {
    assert.equal(withBrowserLang('hi-IN', getLang), 'hi');
  });

  test('Hindi browser (hi) → "hi"', () => {
    assert.equal(withBrowserLang('hi', getLang), 'hi');
  });

  test('Arabic browser (ar-SA) → "ar"', () => {
    assert.equal(withBrowserLang('ar-SA', getLang), 'ar');
  });

  test('Arabic browser (ar-EG) → "ar"', () => {
    assert.equal(withBrowserLang('ar-EG', getLang), 'ar');
  });

  test('Arabic browser (ar) → "ar"', () => {
    assert.equal(withBrowserLang('ar', getLang), 'ar');
  });

  test('German browser (de-DE) → "de"', () => {
    assert.equal(withBrowserLang('de-DE', getLang), 'de');
  });

  test('German browser (de-AT) → "de"', () => {
    assert.equal(withBrowserLang('de-AT', getLang), 'de');
  });

  test('German browser (de) → "de"', () => {
    assert.equal(withBrowserLang('de', getLang), 'de');
  });

  test('Portuguese browser (pt-BR) → "pt"', () => {
    assert.equal(withBrowserLang('pt-BR', getLang), 'pt');
  });

  test('Portuguese browser (pt-PT) → "pt"', () => {
    assert.equal(withBrowserLang('pt-PT', getLang), 'pt');
  });

  test('Portuguese browser (pt) → "pt"', () => {
    assert.equal(withBrowserLang('pt', getLang), 'pt');
  });

  test('Unsupported language (fr-FR) → falls back to "pt"', () => {
    assert.equal(withBrowserLang('fr-FR', getLang), 'pt');
  });

  test('Unsupported language (ja-JP) → falls back to "pt"', () => {
    assert.equal(withBrowserLang('ja-JP', getLang), 'pt');
  });

  test('Unsupported language (ko) → falls back to "pt"', () => {
    assert.equal(withBrowserLang('ko', getLang), 'pt');
  });

  test('Empty navigator.language → falls back to "pt"', () => {
    assert.equal(withBrowserLang('', getLang), 'pt');
  });

  test('Uppercase language tag (EN-US) is normalised → "en"', () => {
    assert.equal(withBrowserLang('EN-US', getLang), 'en');
  });

  test('Mixed-case language tag (Zh-CN) is normalised → "zh"', () => {
    assert.equal(withBrowserLang('Zh-CN', getLang), 'zh');
  });

});

// ---------------------------------------------------------------------------
// Tests: returning visitor (preference already saved in localStorage)
// ---------------------------------------------------------------------------

describe('getLang() — returning visitor (saved preference wins)', () => {

  test('saved "en" overrides German browser', () => {
    assert.equal(withSavedLang('en', 'de-DE', getLang), 'en');
  });

  test('saved "es" overrides English browser', () => {
    assert.equal(withSavedLang('es', 'en-US', getLang), 'es');
  });

  test('saved "zh" overrides Portuguese browser', () => {
    assert.equal(withSavedLang('zh', 'pt-BR', getLang), 'zh');
  });

  test('saved "hi" overrides Arabic browser', () => {
    assert.equal(withSavedLang('hi', 'ar-SA', getLang), 'hi');
  });

  test('saved "ar" overrides Hindi browser', () => {
    assert.equal(withSavedLang('ar', 'hi-IN', getLang), 'ar');
  });

  test('saved "de" overrides Spanish browser', () => {
    assert.equal(withSavedLang('de', 'es-ES', getLang), 'de');
  });

  test('saved "pt" overrides English browser', () => {
    assert.equal(withSavedLang('pt', 'en-US', getLang), 'pt');
  });

});
