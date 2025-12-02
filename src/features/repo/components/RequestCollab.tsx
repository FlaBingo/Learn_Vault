"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";

export default function RequestCollab({ name, repoName }: { name?: string, repoName: string }) {
  const firstName = name?.split(" ")[0] ?? "User";

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="max-w-md mx-auto flex flex-col gap-6 p-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-2"
        >
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Collab with <span className="text-primary">{firstName}</span>
          </h2>
          <div className="text-sm text-muted-foreground leading-relaxed">
            Select a permission level to request access to the <br />
            <span className="font-medium text-foreground">&ldquo;{repoName}&rdquo;</span> repository.
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-col gap-6"
        >
          <RadioGroup defaultValue="viewer" className="grid gap-4">
            
            {/* Viewer Option */}
            <div className="flex items-start space-x-3 rounded-md border p-4 shadow-sm hover:bg-accent/50 transition-colors">
              <RadioGroupItem value="viewer" id="r1" className="mt-1" />
              <Label htmlFor="r1" className="w-full cursor-pointer grid gap-1.5">
                <span className="font-semibold text-foreground">
                    Viewer
                </span>
                <span className="text-xs text-muted-foreground font-normal">
                    Can view code and raise issues, but cannot edit.
                </span>
              </Label>
            </div>

            {/* Editor Option */}
            <div className="flex items-start space-x-3 rounded-md border p-4 shadow-sm hover:bg-accent/50 transition-colors">
              <RadioGroupItem value="editor" id="r2" className="mt-1" />
              <Label htmlFor="r2" className="w-full cursor-pointer grid gap-1.5">
                <span className="font-semibold text-foreground">
                    Editor
                </span>
                <span className="text-xs text-muted-foreground font-normal">
                    Can commit changes, manage PRs, and edit content.
                </span>
              </Label>
            </div>

            {/* Admin Option */}
            <div className="flex items-start space-x-3 rounded-md border p-4 shadow-sm hover:bg-accent/50 transition-colors">
              <RadioGroupItem value="admin" id="r3" className="mt-1" />
              <Label htmlFor="r3" className="w-full cursor-pointer grid gap-1.5">
                <span className="font-semibold text-foreground">
                    Admin
                </span>
                <span className="text-xs text-muted-foreground font-normal">
                    Full access including settings and collaborator management.
                </span>
              </Label>
            </div>

          </RadioGroup>

          <Button className="w-full py-6 text-base font-semibold shadow-md transition-all hover:scale-[1.02] cursor-pointer">
            Send Request
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}