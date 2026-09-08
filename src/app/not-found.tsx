import { SiteFooter, SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 py-24 text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink">
          That page is not here
        </h1>
        <p className="mt-3 max-w-md text-ink-soft">
          The boarding may have been taken down, or the link is wrong. The board
          is still up.
        </p>
        <div className="mt-7 flex gap-3">
          <ButtonLink href="/boardings">Browse boardings</ButtonLink>
          <ButtonLink href="/" variant="outline">
            Go home
          </ButtonLink>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
