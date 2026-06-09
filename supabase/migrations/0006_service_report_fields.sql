-- =====================================================================
-- LEVENT MARINE — Service report extra fields
-- "Outstanding items / NIL" line + typed engineer / chief-engineer name &
-- rank for the dual signature block (the wet signature + ship's stamp are
-- added onboard on the printed PDF). See DOCUMENT-STANDARD.md §3.
-- =====================================================================
alter table service_reports add column if not exists outstanding   text;
alter table service_reports add column if not exists engineer_name text;
alter table service_reports add column if not exists ce_name       text;
alter table service_reports add column if not exists ce_rank       text;
