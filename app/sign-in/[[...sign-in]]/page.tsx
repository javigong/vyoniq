import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: "bg-[#6E56CF] hover:bg-[#5A45B5]",
              footerActionLink: "text-[#6E56CF] hover:text-[#5A45B5]",
            },
          }}
        />
      </div>
    </div>
  );
}
