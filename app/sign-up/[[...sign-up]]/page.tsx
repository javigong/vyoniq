import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <SignUp
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
