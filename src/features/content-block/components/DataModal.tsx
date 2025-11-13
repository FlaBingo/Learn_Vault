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
import {
  createBlock,
  getContentById,
  updateBlock,
} from "../actions/content-block";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useContentModal } from "./ContentModalContext";

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
  const { contentBlock } = useContentModal();
  let order: number;
  let BlockId: string;
  if (contentBlock) {
    order = contentBlock.order;
    BlockId = contentBlock.id;
  }
  const isEditMode: boolean = !!contentBlock;

  // console.log(content, description, isEditMode); // perfectly working
  const pathname = usePathname();
  const pathArray = pathname.split("/");
  const repoId = pathArray[2];
  const parentId =
    pathArray.length > 3 ? pathArray[pathArray.length - 1] : undefined;

  const [isPending, startTransition] = useTransition();
  const selectedOption = BLOCK_OPTIONS.filter((option) =>
    isEditMode ? option.id === contentBlock?.type : option.id === contentId
  )[0];

  const form = useForm<z.infer<typeof ContentFormSchema>>({
    resolver: zodResolver(ContentFormSchema),
    defaultValues: isEditMode
      ? {
          content: contentBlock?.content,
          description: contentBlock?.description,
        }
      : {
          content: "",
          description: "",
        },
  });

  useEffect(() => {
    if (isEditMode) {
      form.reset({
        content: contentBlock?.content,
        description: contentBlock?.description,
      });
    } else {
      form.reset({
        content: "",
        description: "",
      });
    }
  }, [isEditMode, contentBlock?.content, contentBlock?.description, form]);

  async function onSubmit(values: z.infer<typeof ContentFormSchema>) {
    startTransition(async () => {
      try {
        if (isEditMode) {
          const result = await updateBlock(pathname, {
            id: BlockId,
            repoId,
            type: selectedOption.id,
            order,
            ...values,
          });
          if (result.success) {
            toast.success("Block Updated successfully.");
            onOpenChange(false);
          } else {
            toast.error(result.error);
            console.log(result.error);
          }
        } else {
          const result = await createBlock(pathname, {
            repoId,
            parentId,
            type: selectedOption.id,
            ...values,
          });
          if (result.success) {
            toast.success("Block Created successfully.");
            onOpenChange(false);
          } else {
            toast.error(result.error);
            console.log(result.error);
          }
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
        {/* 1. Add flex layout and a max-height to the DialogContent.
       'max-h-[90dvh]' limits the height to 90% of the dynamic viewport height.
  */}
        <DialogContent className="flex flex-col max-h-[90dvh]">
          <DialogHeader>
            <DialogTitle>Enter the data</DialogTitle>
            <DialogDescription>
              fill the inputs to create a content block
            </DialogDescription>
          </DialogHeader>

          {/* 2. Create a new scrollable wrapper for the form.
         - 'flex-1' makes this div take up all available vertical space.
         - 'overflow-y-auto' adds a scrollbar *only* if the content inside overflows.
         - '-mx-6 px-6' is a common trick to make the scrollbar flush with the
           dialog edges by removing the parent's horizontal padding and re-adding it inside.
         - 'py-4' adds a little breathing room.
    */}
          <div className="flex-1 overflow-y-auto -mx-6 px-6 py-4">
            <Form {...form}>
              {/* 3. Give the form an 'id' so the external button can trigger it.
               */}
              <form
                id="content-form"
                onSubmit={form.handleSubmit(onSubmit, onError)}
                className="space-y-8"
              >
                {/* Form fields are unchanged */}
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
                          <Textarea
                            placeholder={selectedOption.contentPlaceholder}
                            {...field}
                          />
                        ) : (
                          <Input
                            placeholder={selectedOption.contentPlaceholder}
                            {...field}
                          />
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
                    const MAX_LENGTH =
                      selectedOption.id === "qna" ? undefined : 150;
                    const remainingChars =
                      MAX_LENGTH && MAX_LENGTH - (field.value?.length || 0);
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
                          {selectedOption.descMessage}
                          <br />
                          {remainingChars && (
                            <>
                              <span className="text-red-400 font-bold">
                                {remainingChars}
                              </span>{" "}
                              characters remaining
                              <br />
                              Up to {MAX_LENGTH} characters.
                            </>
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </form>
            </Form>
          </div>

          {/* 4. Move DialogFooter to be a *direct child* of DialogContent.
         This "sticks" it to the bottom of the flex container.
    */}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"outline"} className="cursor-pointer">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              form="content-form" // <-- 5. Link this button to the form's id.
              disabled={isPending}
              className="cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-1" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : isEditMode ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
