import { Button } from "./ui/button";
import { useSession } from "next-auth/react";



export default function NewRepo() {
  const {data: session} = useSession();
  return (
    <>
      { session ?? (
        <Button>
          
        </Button>
      )}
    </>
  )
}