"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";

export default function RequestCollab({ name, repoName }: { name?: string, repoName: string }) {
  const firstName = name?.split(" ")[0] ?? "";

  return (
    <Card className="">
      <CardContent className="h-[40vh] flex flex-col items-center justify-center gap-6 p-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-bold text-center"
        >
          Request {firstName} a Collab to access {repoName}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-col justify-center items-center"
        >
          <RadioGroup defaultValue="default">
            <div className="flex items-center gap-3">
              <RadioGroupItem value="default" id="r1" />
              <Label htmlFor="r1">Viewer</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="editor" id="r2" />
              <Label htmlFor="r2">Editor</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="admin" id="r3" />
              <Label htmlFor="r3">Admin</Label>
            </div>
          </RadioGroup>

          <Button className="mt-5 px-6 py-2 text-lg rounded-full shadow-md cursor-pointer">
            Send Request
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}
