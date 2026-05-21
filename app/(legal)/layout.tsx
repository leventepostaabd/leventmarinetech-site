export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="lm-screen bg-white">
      <div className="lm-screen-body px-5 md:px-8">
        <div className="container-x py-8 md:py-12 max-w-3xl prose prose-slate">
          {children}
        </div>
      </div>
    </div>
  );
}
