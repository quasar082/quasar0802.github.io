import { CursorHoverImage } from '@/components/ui/cursor-hover-image';
import { SpinningText } from '@/components/ui/spinning-text';

export function AboutSection() {
  return (
    <section id="about" className="box-border lg:h-dvh bg-white px-4 py-10 text-black sm:px-6 lg:px-8" aria-label="About section">
      <div className="container mx-auto grid lg:h-full grid-cols-1 grid-rows-1 gap-6 md:grid-cols-5 md:grid-rows-4">
        <h2 className="text-4xl mt-8 leading-tight md:col-start-2 md:col-end-6 md:row-start-1 md:row-end-3 text-[clamp(2rem,4vmin,3rem)] md:text-[clamp(2rem,4vmin,4rem)] lg:text-[clamp(2rem,5vmin,4rem)] xl:text-[clamp(2rem,6vmin,4rem)]">
          Hi! My name is{' '}
          <CursorHoverImage src="/images/about.jpg" width={320} height={210} className="inline underline underline-offset-8">
            Ha Minh Quan
          </CursorHoverImage>{' '}
          ~{' '}
          <CursorHoverImage src="/images/hero.jpg" width={320} height={210} className="inline underline underline-offset-8">
            Quasar
          </CursorHoverImage>
          . An AI engineer based in Vietnam. I focus on architecture design, operational optimization, and scaling intelligent systems - from large-scale unstructured data processing, multi-agent systems, and chatbots to real-world deployment.
        </h2>

        <p className="whitespace-pre-line text-sm tracking-wide md:col-start-1 md:col-end-2 md:row-start-4 md:row-end-5 md:text-base mt-8">
          CRAFTING END-TO-END
          {'\n'}ARTIFICIAL INTELLIGENCE
          {'\n'}SYSTEMS AND PIPELINES.
        </p>
        <div className="whitespace-pre-line text-sm tracking-wide md:col-start-5 md:col-end-6 md:row-start-4 md:row-end-5 md:text-base ">
          <a
            href="/HaMinhQuan_CV.pdf"
            download
            className="group relative inline-flex h-36 w-36 cursor-pointer items-center justify-center rounded-full text-black no-underline"
            aria-label="Download CV"
          >
            <SpinningText>Download CV • Download CV•</SpinningText>
            <span className="absolute inset-0 flex cursor-pointer items-center justify-center text-sm font-normal uppercase group-hover:font-medium">
              click
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
