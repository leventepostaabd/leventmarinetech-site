-- =====================================================================
-- LEVENT MARINE — Split bank routing by payment rail
-- US banks use a DIFFERENT routing number for ACH vs wire (Fedwire), and
-- international payers use SWIFT/BIC (+ optional intermediary bank), not a
-- routing number. Store each separately so the invoice can show the right
-- one per method. See ADMIN-BILLING-SPEC.md.
-- =====================================================================
alter table company_settings add column if not exists bank_routing_ach  text;
alter table company_settings add column if not exists bank_routing_wire text;
alter table company_settings add column if not exists bank_intermediary text;

-- Carry the old single routing value over to the wire field (best guess).
update company_settings
  set bank_routing_wire = coalesce(bank_routing_wire, bank_routing)
  where bank_routing is not null;
