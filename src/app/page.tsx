import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-semibold mb-3">FindWell</h1>
        <p className="text-foreground/60 mb-12">
          Help us build a better way to connect people with the right therapist.
        </p>

        <div className="space-y-4">
          <Link
            href="/therapist"
            className="block w-full px-8 py-4 rounded-xl bg-amber-500 text-white font-medium hover:bg-amber-600 transition-colors text-center"
          >
            I am a therapist
          </Link>
          <Link
            href="/patient"
            className="block w-full px-8 py-4 rounded-xl border-2 border-foreground/15 text-foreground font-medium hover:border-foreground/30 transition-colors text-center"
          >
            I&apos;m sharing my personal experience
          </Link>
        </div>
      </div>
    </div>
  );
}
