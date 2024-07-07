import ImageSync from "@/components/image-sync";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import CtaLink from "@/components/theme/app/cta-link";
import { IoMdChatboxes } from "react-icons/io";

export default function HomePageGuest() {
  return (
    <main className="font-sans">
      <section
        id="landing"
        className="flex justify-center min-h-[90vh] from-0% from-theme-9 to-100% to-theme-8 bg-gradient-to-br text-white"
      >
        <div className="relative max-w-screen-xl px-6 w-full flex flex-col pb-[calc((((80vw-3rem)*0.8)/1.5)*0.3)] xl:pb-[calc((((1280px-3rem)*0.8)/1.5)*0.3)]">
          <Header />
          <div className="flex flex-col py-6 px-4 items-center gap-6 flex-1 justify-center">
            <h1 className="text-center text-2xl sm:text-4xl md:text-5xl font-bold max-w-[80%] leading-snug">
              Save your thoughts
              <br />
              and take control of your life again
            </h1>
            <p className="text-center leading-relaxed">
              Lightweight, intuitive, with a user-friendly interface, MyNotes is
              a web application for users who want an open-source alternative to
              keep their notes organized. You can also set goals, manage your
              daily tasks, and setup alarms.
            </p>
            <CtaLink
              href="/register"
              className="rounded-full text-base mt-4"
              size="lg"
            >
              Start Using
            </CtaLink>
          </div>
          <div className="text-white absolute left-0 top-[calc(100%-((((80vw-3rem)*0.8)/1.5)*0.3))] xl:top-[calc(100%-((((1280px-3rem)*0.8)/1.5)*0.3))] w-full h-[calc(((80vw-3rem)*0.8)/1.5)] xl:h-[calc((1280px-3rem)*0.8/1.5)] flex justify-center">
            <div className="relative h-full w-[calc((80vw-3rem)*0.8)] xl:w-[calc((1280px-3rem)*0.8)]">
              <ImageSync
                src="/screenshot.webp"
                alt="application screenshot"
                fill
                priority
              />
            </div>
          </div>
        </div>
      </section>
      <section className="flex items-center px-6 flex-col gap-6">
        <div className="max-w-screen-xl w-full flex flex-col items-center pt-[calc((((80vw-3rem)*0.8)/1.5)*0.7)] xl:pt-[calc((((1280px-3rem)*0.8)/1.5)*0.7)] text-center">
          <div
            id="features"
            className="max-w-[520px] md:max-w-[800px] gap-5 flex flex-col py-24"
          >
            <span className="text-theme-6 text-2xl font-medium">
              F E A T U R E S
            </span>
            <h1 className="text-4xl md:text-5xl font-bold">
              Intuitive and Powerful Tool
            </h1>
            <p className="leading-relaxed text-zinc-500 font-medium text-lg">
              Minimalistic, organized, and efficient. Effortlessly jot down and
              save your thoughts, ideas, and plan your routine.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 pb-48 gap-12 md:grid-cols-3 pt-2 max-w-screen-xl">
          <article className="flex flex-col items-center gap-5 text-center">
            <div className="w-28 h-28 rounded-full bg-[#5b51f3] flex justify-center items-center overflow-hidden text-white text-4xl">
              <IoMdChatboxes />
            </div>
            <h1 className="text-2xl font-medium">Expand Your Reach</h1>
            <p className="leading-relaxed text-zinc-500 max-w-[600px]">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
              Suspendisse et justo. Praesent mattis commodo augue.
            </p>
          </article>
          <article className="flex flex-col items-center gap-5 text-center">
            <div className="w-28 h-28 rounded-full bg-[#5b51f3] flex justify-center items-center overflow-hidden text-white text-4xl">
              <IoMdChatboxes />
            </div>
            <h1 className="text-2xl font-medium">Expand Your Reach</h1>
            <p className="leading-relaxed text-zinc-500 max-w-[600px]">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
              Suspendisse et justo. Praesent mattis commodo augue.
            </p>
          </article>
          <article className="flex flex-col items-center gap-5 text-center">
            <div className="w-28 h-28 rounded-full bg-[#5b51f3] flex justify-center items-center overflow-hidden text-white text-4xl">
              <IoMdChatboxes />
            </div>
            <h1 className="text-2xl font-medium">Expand Your Reach</h1>
            <p className="leading-relaxed text-zinc-500 max-w-[600px]">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
              Suspendisse et justo. Praesent mattis commodo augue.
            </p>
          </article>
        </div>
      </section>
      {/* <section className="flex justify-center from-0% from-theme-9 to-100% to-theme-8 bg-gradient-to-br text-white h-40 items-center">
    <div className="relative max-w-screen-xl px-6 w-full flex flex-col items-center gap-4">
      <Link href="/" className="text-3xl font-semibold">
        MyNotes
      </Link>
      <span>Copyright © 2024 Vyzion</span>
    </div>
  </section> */}
      <section className="flex justify-center from-0% from-theme-9 to-100% to-theme-8 bg-gradient-to-br text-white min-h-64 items-center">
        <div className="relative max-w-screen-xl px-6 w-full flex flex-col items-center gap-4">
          <Footer />
        </div>
      </section>
    </main>
  );
}
