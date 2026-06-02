import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Accessibility Statement',
  description:
    "Levent Marine's commitment to WCAG 2.1 AA: semantic HTML, keyboard navigation, visible focus, and tested color contrast.",
  alternates: { canonical: '/accessibility-statement' }
};

export default function Accessibility() {
  return (
    <article>
      <h1>Accessibility Statement</h1>
      <p className="text-ink-subtle"><em>Last updated: {new Date().toISOString().slice(0, 10)}</em></p>

      <p>We aim for WCAG 2.1 AA compliance. The current platform is built with:</p>
      <ul>
        <li>Semantic HTML and ARIA landmarks (main, nav, dialog).</li>
        <li>Skip-to-content link as the first focusable element.</li>
        <li>Keyboard navigation through all interactive elements with visible focus states (amber 2px ring).</li>
        <li>Color contrast tested against text-on-navy and text-on-white combinations.</li>
        <li>Form fields with explicit labels and inline error messages.</li>
        <li>Reduced-motion support: animations dial down when the OS reports <code>prefers-reduced-motion</code>.</li>
      </ul>

      <h2>Known limitations</h2>
      <ul>
        <li>Some legacy assets carry stylistic <code>line-clamp</code> truncation that may shorten text in dense card grids — adjustable via browser zoom.</li>
        <li>Multi-step wizards have not yet been audited with assistive tech end-to-end. Targeted improvements planned for the next release.</li>
      </ul>

      <h2>Contact</h2>
      <p>If you encounter a barrier, please email <a href="mailto:accessibility@leventmarinetech.com">accessibility@leventmarinetech.com</a> with the page URL and a description. We commit to a 5-business-day acknowledgement.</p>
    </article>
  );
}
