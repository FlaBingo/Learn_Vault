
"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function RequestCollab({ name }: { name?: string }) {
  const firstName = name?.split(" ")[0] ?? "";

  return (
    <Card className="">
      <CardContent className="h-[40vh] flex flex-col items-center justify-center gap-6 p-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl font-bold text-center"
        >
          Request {firstName} a Collab
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Button className="px-6 py-2 text-lg rounded-full shadow-md cursor-pointer">
            Send Request
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}
