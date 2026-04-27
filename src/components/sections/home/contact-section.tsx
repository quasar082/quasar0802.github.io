import { TextReveal } from '@/components/ui/text-reveal';
import type { ContactSocial } from '@/lib/content/home';
import { SiteFooter } from './site-footer';

type ContactSectionProps = {
  contactSocials: ContactSocial[];
};

export function ContactSection({ contactSocials }: ContactSectionProps) {
  return (
    <section id="contact" className="box-border h-dvh bg-[#e9e9e9] px-4 pt-10 pb-2 text-black sm:px-6 lg:px-8" aria-label="Contact section">
      <div className="container mx-auto flex h-full flex-col justify-between pt-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-12">
          <div className="flex flex-col gap-6 lg:col-span-1">
            <h2 className="m-0 w-full max-w-none text-[clamp(2rem,2vmin,3rem)]  md:text-[clamp(2rem,4vmin,3rem)] xl:text-[clamp(2rem,5vmin,3rem)] leading-[0.95] tracking-tight">
              <TextReveal>WE WOULD LOVE TO HEAR FROM YOU. LET&apos;S WORK — TOGETHER.</TextReveal>
            </h2>
            <a
              href="mailto:haminhquan12c7@gmail.com"
              className="w-fit rounded-full bg-black px-6 py-3 text-sm font-medium uppercase tracking-wide text-white no-underline"
            >
              Contact us
            </a>
          </div>

          <div className="hidden lg:block" aria-hidden="true" />

          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:gap-x-10">
              <div>
                <p className="m-0 text-xs lg:text-sm font-bold uppercase tracking-[0.08em] text-black">Social</p>
                <ul className="mt-4 m-0 grid list-none gap-2 p-0">
                  {contactSocials.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        className="relative inline-block pb-1 text-base md:text-lg xl:text-2xl leading-tight text-black/55 no-underline transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-black/35 before:absolute before:bottom-0 before:left-0 before:h-px before:w-8 before:bg-[#e9e9e9] before:transition-transform before:duration-500 hover:text-black/80 hover:before:translate-x-[calc(100%-2rem)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                      >
                        {social.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid content-start gap-8">
                <div>
                  <p className="m-0 text-xs lg:text-sm font-bold uppercase tracking-[0.08em] text-black">Contact</p>
                  <a
                    href="tel:0376316144"
                    className="relative mt-4 inline-block pb-1 text-base md:text-lg xl:text-2xl leading-tight text-black/55 no-underline transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-black/35 before:absolute before:bottom-0 before:left-0 before:h-px before:w-8 before:bg-[#e9e9e9] before:transition-transform before:duration-500 hover:text-black/80 hover:before:translate-x-[calc(100%-2rem)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                  >
                    0376316144
                  </a>
                </div>

                <div>
                  <p className="m-0 text-xs lg:text-sm font-bold uppercase tracking-[0.08em] text-black">Address</p>
                  <p className="relative mt-4 inline-block pb-1 text-base md:text-lg xl:text-2xl leading-tight text-black/55 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-black/35 before:absolute before:bottom-0 before:left-0 before:h-px before:w-8 before:bg-[#e9e9e9] before:transition-transform before:duration-500 hover:before:translate-x-[calc(100%-2rem)]">
                    Thu Duc, HCM
                  </p>
                </div>
              </div>

              <div className="col-span-2">
                <p className="m-0 text-xs lg:text-sm font-bold uppercase tracking-[0.08em] text-black">Email</p>
                <a
                  href="mailto:haminhquan12c7@gmail.com"
                  className="relative mt-4 inline-block break-all pb-1  text-base md:text-lg xl:text-2xl leading-tight text-black/55 no-underline transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-black/35 before:absolute before:bottom-0 before:left-0 before:h-px before:w-8 before:bg-[#e9e9e9] before:transition-transform before:duration-500 hover:text-black/80 hover:before:translate-x-[calc(100%-2rem)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                >
                  haminhquan12c7@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <SiteFooter />
      </div>
    </section>
  );
}
