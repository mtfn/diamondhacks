import Link from "next/link";
import { auth0 } from "~/lib/auth0";

export default async function Home() {
  const session = await auth0.getSession();

  return (
    <div className="min-h-screen bg-base-200">
      <main className="container mx-auto px-4 py-16">
        <section className="hero min-h-[70vh] bg-base-200">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Welcome to CLASH</h1>
              <p className="py-6">
                A command line assistant shell that turns learning bash into an
                adventure! Complete challenge sets and master bash fundamentals
                while receiving guidance from our AI tutor.
              </p>
              {session ? (
                <Link href="/app" className="btn btn-primary">
                  Start Your Journey
                </Link>
              ) : (
                <a href="/auth/login?redirect_uri=/app" className="btn btn-primary">
                  Login to Get Started
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16">
          <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Interactive Challenges</h3>
                <p>
                  Practice your bash skills with real-world command line tasks.
                </p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Virtual Shell Environment</h3>
                <p>
                  Experience a fully functional shell right in your browser.
                </p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">AI Tutor Assistance</h3>
                <p>
                  Get hints and guidance from our AI tutor without direct
                  answers to help you learn.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Challenge Sets Section */}
        <section id="challenge" className="py-16 bg-base-100">
          <h2 className="text-3xl font-bold text-center mb-8">
            Challenge Sets
          </h2>
          <div className="flex flex-col items-center">
            <p className="max-w-2xl text-center mb-4">
              Dive into carefully designed challenge sets that teach you the
              essentials of bash—from basic commands to advanced scripting.
            </p>
          </div>
        </section>

        {/* AI Tutor Section */}
        <section id="ai-tutor" className="py-16">
          <h2 className="text-3xl font-bold text-center mb-8">AI Tutor</h2>
          <div className="flex flex-col items-center">
            <p className="max-w-2xl text-center mb-4">
              Our integrated AI tutor is here to facilitate learning. It won’t
              simply give you the answers but will guide you with hints and
              nudges to help you think critically.
            </p>
          </div>
        </section>
      </main>

      <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
        <aside>
          <p>
            Copyright © {new Date().getFullYear()}
          </p>
        </aside>
      </footer>
    </div>
  );
}
