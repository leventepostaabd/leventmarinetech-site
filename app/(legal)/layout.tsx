export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-x py-12 md:py-16 max-w-3xl prose prose-slate">
      {children}
    </div>
  );
}
