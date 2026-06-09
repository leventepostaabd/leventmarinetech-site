export const dynamic = 'force-dynamic';

export default function ServiceReportsPage() {
  return (
    <div>
      <div className="mb-4">
        <div className="kicker">Evrak & Finans</div>
        <h2 className="text-[20px] mt-0.5">Servis Raporları</h2>
      </div>
      <div className="card max-w-xl border-l-4 border-l-amber">
        <p className="text-[13.5px] text-ink-muted">
          Servis/attendance raporu (fotoğraf + gemide Chief Engineer çift imzası + kalibrasyonlu ölçüm tablosu +
          class formatı) Faz 1&apos;in sonraki diliminde gelecek. Şema hazır (<span className="font-mono">service_reports</span>,
          <span className="font-mono"> service_report_photos</span>); bu, jenerik fatura araçlarının yapamadığı asıl rekabet farkımız.
        </p>
      </div>
    </div>
  );
}
