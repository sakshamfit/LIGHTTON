import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Contact",
  description: "Showroom visits, lighting plans and trade enquiries.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        title="Contact"
        intro="Showroom visits, lighting plans for a project, or a question about a piece — the studio replies within one working day."
      />
      <div className="wrap grid gap-16 pb-[var(--section)] lg:grid-cols-12">
        <div className="space-y-12 lg:col-span-4">
          <div>
            <p className="t-caption text-fg-3">Showroom</p>
            <address className="t-lead mt-4 not-italic">
              Vesper Lighting Studio
              <br />
              Rua das Janelas Verdes 28
              <br />
              1200-692 Lisbon, Portugal
            </address>
            <p className="t-small mt-4 text-fg-2">Tuesday – Saturday, 11:00 – 19:00. Visit after sunset on Thursdays, when the showroom stays open until 22:00.</p>
          </div>
          <div>
            <p className="t-caption text-fg-3">Studio</p>
            <p className="mt-4 space-y-1">
              <a href="mailto:studio@vesper.example" className="u-link block w-fit">
                studio@vesper.example
              </a>
              <a href="tel:+351210000000" className="u-link block w-fit">
                +351 21 000 0000
              </a>
            </p>
          </div>
          <div id="delivery" className="scroll-mt-28">
            <p className="t-caption text-fg-3">Delivery & returns</p>
            <ul className="t-small mt-4 space-y-2 text-fg-2">
              <li>Complimentary standard delivery on orders over $500.</li>
              <li>Express (1–2 days) and white-glove installation available.</li>
              <li>30-day returns on unused pieces; made-to-order finishes are final sale.</li>
              <li>Two-year guarantee on every fixture, and spare parts for life.</li>
            </ul>
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <ContactForm />
        </div>
      </div>
    </>
  );
}
