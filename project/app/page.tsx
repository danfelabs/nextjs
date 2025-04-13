import RegisterOffer from "@/app/register/RegisterOffer";
import Header from "@components/Header";

export default function Home() {
  return (
    <div>
      <Header />
      <main className="mt-16">
        <RegisterOffer />
      </main>
    </div>
  );
}
