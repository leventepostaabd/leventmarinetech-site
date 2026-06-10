-- =====================================================================
-- LEVENT MARINE — Invoice payment scope (domestic vs international)
-- Lets each invoice pick which remittance rails to print: US domestic
-- (ACH + wire routing) and/or international (SWIFT/BIC + intermediary).
-- Values: 'both' | 'domestic' | 'international'. Default 'both' — show both
-- rails under clear headings so the payer (who may have a US entity) chooses.
-- =====================================================================
alter table invoices add column if not exists payment_scope text not null default 'both';
