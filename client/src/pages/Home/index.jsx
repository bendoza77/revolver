import { AnimatePresence } from "framer-motion";
import { useAppContext } from "@context/AppContext";
import PageLayout from "@components/layout/PageLayout";
import Loader from "@components/ui/Loader";

import Hero from "./sections/Hero";
import Marquee from "./sections/Marquee";
import Services from "./sections/Services";
import Benefits from "./sections/Benefits";
import Pricing from "./sections/Pricing";
import Portfolio from "./sections/Portfolio";
import CTA from "./sections/CTA";

export default function Home() {
  const { isLoading, finishLoading } = useAppContext();

  return (
    <>
      <AnimatePresence>
        {isLoading && <Loader onDone={finishLoading} />}
      </AnimatePresence>

      {!isLoading && (
        <PageLayout>
          <Hero />
          <Marquee />
          <Services />
          <Benefits />
          <Pricing />
          <Portfolio />
          <CTA />
        </PageLayout>
      )}
    </>
  );
}
