import { Metadata } from "next";
import { categories } from "@/app/data/packages";
import { getServicePageData } from "@/app/data/service-details";
import ServiceHero from "../components/ServiceHero";
import ProblemSolution from "../components/ProblemSolution";
import TierSelector from "../components/TierSelector";
import FeatureDeepDive from "../components/FeatureDeepDive";
import UseCases from "../components/UseCases";
import AddOnsSection from "../components/AddOnsSection";
import ProcessSteps from "../components/ProcessSteps";
import ComparisonTable from "../components/ComparisonTable";
import ServiceFAQ from "../components/ServiceFAQ";
import ServiceCTA from "../components/ServiceCTA";

const SERVICE_ID = "web-app";

export const metadata: Metadata = {
  title: "Web App — Prezzi e Pacchetti | Edizioni Duepuntozero",
  description:
    "Applicazioni web su misura con dashboard e autenticazione. Da €2.999, consegna in 7 giorni. Scalabili, sicure, prezzo trasparente.",
};

export default function WebAppPage() {
  const data = getServicePageData(SERVICE_ID)!;
  const category = categories.find((c) => c.id === SERVICE_ID)!;

  return (
    <>
      <ServiceHero hero={data.hero} serviceId={SERVICE_ID} lottiePath={category.lottie || ""} />
      <ProblemSolution data={data.problemSolution} />
      <TierSelector serviceId={SERVICE_ID} tierDetails={data.tierDetails} tiers={category.tiers} />
      <FeatureDeepDive features={data.featureDetails} />
      <UseCases cases={data.useCases} />
      <AddOnsSection addOns={category.addOns} />
      <ProcessSteps />
      <ComparisonTable />
      <ServiceFAQ items={data.faq} />
      <ServiceCTA serviceId={SERVICE_ID} />
    </>
  );
}
