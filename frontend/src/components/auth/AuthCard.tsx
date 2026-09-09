import { Container } from "@/components/ui/Container";

export function AuthCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-20">
      <Container size="lg">
        <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-[#0F1729] p-8">
          <h1 className="mb-6 text-center font-display text-2xl text-[#F6EFDD]">{title}</h1>
          {children}
        </div>
      </Container>
    </section>
  );
}
