import LoginForm from "@/components/LoginForm";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-background flex items-center justify-center">
      <div className="border-[#676767] w-[1280px] h-[800px] border m-[100px] flex items-center justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
