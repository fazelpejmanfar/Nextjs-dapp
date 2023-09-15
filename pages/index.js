import Head from "next/head";
import Image from "next/image";
import Header from "../components/Header";
import Mint from "../components/Mint";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div
      className="flex flex-col min-h-screen justify-center items-center"
    >
      <Head>
        <title>Pomedoge Minting dApp</title>
        <meta name="description" content="Created by Pome" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <section className="w-full px-5">
        <Mint />
      </section>
      <Footer/>
    </div>
  );
}
