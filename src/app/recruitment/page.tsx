import Image from "next/image";
import Link from "next/link";
import { SearchableText } from "@/global-components/search/searchable-text";
import { recruitmentConfig } from "./recruitment-data";

// Set isRecruitmentOpen to true when applications are open, or false when
// recruitment is closed. Update recruitmentFormUrl when the application form
// changes. The open and closed images are configured separately because they
// intentionally use different render styles.
export default function RecruitmentPage() {
  const isRecruitmentOpen = recruitmentConfig.isRecruitmentOpen;

  const statusContent = isRecruitmentOpen
    ? {
        heading: "Recruitment is Now Open",
        copy: "Join MUAS and help shape the next generation of drone technology.",
        image: recruitmentConfig.openImage,
      }
    : {
        heading: "Ready to take flight?",
        copy: "Check back soon for future opportunities with Monash Uncrewed Aerial Systems!",
        image: recruitmentConfig.closedImage,
      };

  return (
    <main className="min-h-dvh overflow-x-hidden bg-[linear-gradient(180deg,#02040a_0%,#001f49_48%,#02040a_100%)] text-white">
      <section
        id="recruitment-page"
        className="relative isolate flex viewport-fold scroll-mt-20 items-center overflow-hidden py-8 sm:py-10 lg:py-12"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_16%_10%,rgba(0,74,173,0.34),transparent_30%),radial-gradient(circle_at_86%_58%,rgba(84,134,200,0.18),transparent_34%)]" />

        {/* Background grid */}
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:84px_84px] opacity-25" />

        {/* Shared page container aligned with the navbar controls */}
        <div className="mx-auto flex w-full max-w-[1720px] min-w-0 flex-col justify-center px-5 sm:px-8 lg:px-12">
          <div className="grid w-full min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.68fr)_minmax(680px,1.32fr)] lg:items-center lg:gap-16">
            {/* Recruitment text */}
            <div className="min-w-0 max-w-4xl">
              <SearchableText
                as="h1"
                searchId="recruitment-heading"
                className="max-w-full text-[clamp(3rem,8vw,7rem)] font-medium leading-[0.92] tracking-[-0.05em] text-white"
              >
                Recruitment
              </SearchableText>

              <SearchableText
                as="p"
                searchId="recruitment-intro"
                className="mt-5 max-w-[21rem] break-words text-b1 leading-relaxed text-blue-50 sm:max-w-3xl sm:text-subtitle lg:mt-6"
              >
                MUAS welcomes students from all backgrounds, technical and non-technical, to contribute to a team designing, building, testing, and flying uncrewed aerial systems.
              </SearchableText>

              <div className="mt-7 max-w-[21rem] border-l-2 border-blue-300/70 pl-4 sm:mt-9 sm:max-w-2xl sm:pl-5 lg:mt-12">
                <SearchableText
                  as="h2"
                  searchId="recruitment-status-heading"
                  className="text-h7 font-bold leading-tight tracking-[-0.03em] text-white sm:text-h5"
                >
                  {statusContent.heading}
                </SearchableText>

                <SearchableText
                  as="p"
                  searchId="recruitment-status-copy"
                  className="mt-3 break-words text-b1 leading-relaxed text-blue-50 sm:text-subtitle"
                >
                  {statusContent.copy}
                </SearchableText>

                {isRecruitmentOpen ? (
                  <Link
                    href={recruitmentConfig.recruitmentFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-search-target-id="recruitment-apply"
                    data-search-highlight-mode="text"
                    className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-white px-6 py-3 text-b1 font-bold text-blue-900 transition-colors hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:min-h-12"
                  >
                    Apply Now
                  </Link>
                ) : null}
              </div>
            </div>

            {/* Recruitment visual aligned to the right container edge */}
            <div className="relative flex min-w-0 items-center justify-center lg:justify-end">
              <div className="relative h-[300px] w-full overflow-hidden border border-blue-100/20 bg-blue-900 shadow-[0_34px_110px_rgba(0,0,0,0.46)] [clip-path:polygon(7%_0,100%_0,100%_100%,0_100%)] sm:h-[430px] lg:h-[min(560px,calc(100svh-10rem))]">
                <div className="absolute -inset-8 bg-blue-500/18 blur-3xl" />

                <Image
                  src={statusContent.image.src}
                  alt={statusContent.image.alt}
                  blurDataURL={statusContent.image.blurDataURL}
                  fill
                  fetchPriority="high"
                  placeholder={
                    statusContent.image.blurDataURL ? "blur" : "empty"
                  }
                  priority
                  sizes="(min-width: 1720px) 1018px, (min-width: 1024px) 62vw, calc(100vw - 40px)"
                  className="object-cover"
                  style={{
                    objectPosition: isRecruitmentOpen ? "50% 50%" : "50% 46%",
                  }}
                />

                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.32)_0%,rgba(0,31,73,0.06)_48%,rgba(0,0,0,0.22)_100%),linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,31,73,0.38)_100%)]" />

                <div className="absolute inset-x-6 top-5 h-px bg-blue-100/35" />

                <div className="absolute bottom-5 right-7 h-10 w-28 border-b border-r border-blue-100/30" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
