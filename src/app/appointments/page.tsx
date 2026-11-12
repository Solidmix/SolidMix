import type { Metadata } from "next";
import { getPageContent, resolvePageH1 } from "@/lib/content";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd } from "@/lib/seo";
import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { PostGrid } from "@/components/PostGrid";
import { getAllPostsSorted } from "@/lib/posts";

const content = getPageContent("appointments");
const h1 = resolvePageH1(content);
const latestPosts = getAllPostsSorted().slice(0, 3);

export const metadata: Metadata = pageMetadata(content, "/appointments/");

export default function AppointmentsPage() {
  return (
    <>
      <JsonLd data={[breadcrumbLd([{ name: "Home", url: "/" }, { name: "Appointments" }])]} />
      <section className="overflow-x-clip bg-gradient-to-br from-primary to-secondary py-16 text-center text-white md:py-20">
        <div className="container-content">
          <h1 className="text-3xl font-semibold md:text-4xl">{h1}</h1>
        </div>
      </section>
      <section className="-mt-10 pb-10 md:pb-14">
        <div className="container-content max-w-2xl rounded-lg border border-grey-line bg-white p-6 shadow-lg md:p-10">
          <AppointmentForm />
        </div>
      </section>
      <section className="py-10 md:py-14">
        <div className="container-content">
          <h2 className="text-center text-[28px] font-semibold text-primary md:text-[40px]">
            Our Blogs &amp; News
          </h2>
          <p className="mt-2 text-center text-[20px] text-primary">Insights, Updates, and Industry Stories</p>
          <div className="mt-8">
            <PostGrid posts={latestPosts} excerptColor="#777777" />
          </div>
        </div>
      </section>
    </>
  );
}
