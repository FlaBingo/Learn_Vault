import { signIn } from "@/services/auth";

export default function SignIn({ provider }: { provider: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn(provider);
      }}
    >
      <button type="submit">Signin with {provider}</button>
    </form>
  );
}
