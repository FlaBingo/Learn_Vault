// src\features\content-block\components\DataModal.tsx

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

import { FieldErrors, useForm } from "react-hook-form";
import z from "zod";
import {
  ContentBlockSchema,
  ContentFormSchema,
} from "../schemas/content-block";
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
import { useEffect, useRef, useTransition } from "react";
import { createBlock } from "../actions/content-block";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

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
  const pathname = usePathname();
  const pathArray = pathname.split("/");
  const repoId = pathArray[2];
  const parentId = pathArray.length > 3 ? pathArray[pathArray.length-1] : undefined;
  // console.log("pathname: ", pathArray, parentId)
  // console.log("parentId: ", parentId);
  const [isPending, startTransition] = useTransition();
  const selectedOption = BLOCK_OPTIONS.filter(
    (option) => option.id === contentId
  )[0];

  const form = useForm<z.infer<typeof ContentFormSchema>>({
    resolver: zodResolver(ContentFormSchema),
    defaultValues: {
      content: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ContentFormSchema>) {
    startTransition(async () => {
      try {
        const result = await createBlock(pathname, {
          repoId,
          parentId,
          type: selectedOption.id,
          ...values,
        });
        if (result.success) {
          toast.success("Block created successfully.");
          onOpenChange(false);
        } else {
          toast.error(result.error);
          console.log(result.error);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }
  function onError(errors: FieldErrors<z.infer<typeof ContentBlockSchema>>) {
    console.error("Form Validation Failed:", errors);
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
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="space-y-8"
            >
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
                      {selectedOption.contentEl === "textarea" ? (
                        <Textarea placeholder={selectedOption.contentPlaceholder} {...field} />
                      ) : (
                        <Input placeholder={selectedOption.contentPlaceholder} {...field} />
                      )}
                    </FormControl>
                    <FormDescription>
                      {selectedOption.contentMessage}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => {
                  const MAX_LENGTH = 150;
                  const remainingChars =
                    MAX_LENGTH - (field.value?.length || 0);
                  return (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={selectedOption.descPlaceholder}
                          maxLength={MAX_LENGTH}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {selectedOption.descMessage}<br/>
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
                  <Button variant={"outline"} className="cursor-pointer">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-1"/>
                      Creating...
                    </>
                  ) : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
