// Global ambient locale type. Declared globally (no import/export in this
// file) so every component/lib can annotate `locale: Locale` without an
// import. Keep in sync with LOCALES in lib/i18n.ts.
declare type Locale = 'en' | 'tr' | 'el' | 'es' | 'de';
