"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useForm } from "react-hook-form";
import z from "zod";
import { newContentSchema } from "../schemas/content-block";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ContentType } from "@/drizzle/schema";
import { BLOCK_OPTIONS } from "@/lib/content-block-utils/block-options";
import { Textarea } from "@/components/ui/textarea";

export default function ContentFormModal({
  children,
  open,
  onOpenChange,
  contentId,
}: {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentId: ContentType | null;
}) {
  const selectedOption = BLOCK_OPTIONS.filter(
    (option) => option.id === contentId
  )[0];

  const form = useForm<z.infer<typeof newContentSchema>>({
    resolver: zodResolver(newContentSchema),
    defaultValues: {
      content: "",
      description: "",
      bgColor: "",
    },
  });

  async function onSubmit() {
    console.log("klsdjflkajsdlfkjasdjkf");
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter the data</DialogTitle>
            <DialogDescription>
              fill the inputs to create a content block
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Form fields here */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {<selectedOption.icon className="size-4" />}{" "}
                      {selectedOption.label}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the content" {...field} />
                    </FormControl>
                    <FormDescription>
                      {selectedOption.description}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => {
                  const MAX_LENGTH = 100;
                  const remainingChars =
                    MAX_LENGTH - (field.value?.length || 0);
                  return (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter a description"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        <span className="text-red-400 font-bold">
                          {remainingChars}
                        </span>{" "}
                        characters remaining
                        <br />
                        Up to {MAX_LENGTH} characters.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant={"outline"}>Cancel</Button>
                </DialogClose>
                <Button type="submit">Create</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
