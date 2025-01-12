import Game from "@/components/Game";
import Footer from "@/components/Footer";
import Image from "next/image";
export default function Home() {
    return (
        <div className="grid grid-rows-[1fr_auto] items-center justify-items-center min-h-screen pb-8 gap-8 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 items-center sm:items-start">
                <Game />
                <Image src="/icon.svg" alt="icon" width={50} height={50} />
            </main>
            <Footer />
        </div>
    );
}
