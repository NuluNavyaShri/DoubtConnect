import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="flex items-center justify-between px-16 py-6 border-b border-black/10">
        <Link to="/" className="flex gap-4 items-end font-bold text-[25px]">
          <img src={"/logo.png"} className="w-14 rounded-md" />{" "}
          <span>DoubtConnect</span>
        </Link>

        {/* <nav className="flex items-center gap-8 text-sm">
          <a className="hover:underline">About</a>
          <a className="hover:underline">Community</a>
          <a className="hover:underline">Write</a>
          <a className="hover:underline">Sign in</a> */}
        <Link to="/auth" className="bg-black text-white px-5 py-2 rounded-full">
          Get started
        </Link>
        {/* </nav> */}
      </header>

      {/* Hero */}
      <main className="flex-1 grid grid-cols-2 px-16 py-24 gap-12">
        {/* Left */}
        <section>
          <h1 className="text-[96px] leading-[1.05] font-bold">
            Doubts,
            <br />
            Ideas & Clarity
          </h1>

          <p className="mt-8 text-xl max-w-xl">
            A place to ask, explain, and deepen your understanding through
            thoughtful discussion.
          </p>

          <Link
            to="/auth"
            className="inline-block mt-10 bg-black text-white px-8 py-3 rounded-full text-lg"
          >
            Start exploring
          </Link>
        </section>

        {/* Right (Visual Placeholder) */}
        <section className="relative">
          <div className="absolute right-0 top-0 w-[360px] h-[360px] bg-green-500/90 rounded-sm" />
          <div className="absolute right-20 bottom-20 w-[180px] h-[180px] border border-black/30" />
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm py-6 border-t border-black/10 text-black/60">
        Help &nbsp;&nbsp; · &nbsp;&nbsp; About &nbsp;&nbsp; · &nbsp;&nbsp;
        Privacy &nbsp;&nbsp; · &nbsp;&nbsp; Terms
      </footer>
    </div>
  );
}
