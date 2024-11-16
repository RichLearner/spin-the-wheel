import LotteryWheel from "@/components/WheelSpin";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <LotteryWheel />
      </div>
    </main>
  );
}
