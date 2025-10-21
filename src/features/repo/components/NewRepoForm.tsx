"use client";
import { useForm } from "react-hook-form";
import { newRepoSchema } from "../schemas/repo";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createNewRepo, updateRepo } from "../actions/repo";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { repoStatus } from "@/lib/types/repoTypes";
import { Loader2 } from "lucide-react";

type RepoData =
  | {
      id: string;
      title: string;
      description: string | null;
      status: repoStatus;
    }
  | undefined;

export default function NewRepoForm({
  initialData,
}: {
  initialData?: RepoData | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditMode = !!initialData;

  const form = useForm<z.infer<typeof newRepoSchema>>({
    resolver: zodResolver(newRepoSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description || "",
          status: initialData.status,
        }
      : {
          title: "",
          description: "",
          status: "private",
        },
  });

  async function onSubmit(values: z.infer<typeof newRepoSchema>) {
    startTransition(async () => {
      try {
        if (isEditMode) {
          const result = await updateRepo(initialData.id, values);
          if (result.success) {
            toast.success(result.message);
            router.replace("/my-repos");
          } else {
            toast.error(result.error);
          }
        } else {
          const result = await createNewRepo(values);
          if (result.success) {
            toast.success(result.message);
            router.replace("/my-repos");
          } else {
            toast.error(result.message);
          }
        }
      } catch (error) {
        console.log("Error in submit handler function", error);
      }
    });
  }

  return (
    <>
      <div className="container mx-auto mt-7">
        <Breadcrumb className="px-4 py-1 mb-3 bg-accent rounded-sm">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {isEditMode ? (
              <>
                <BreadcrumbItem>Edit Repository</BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            ) : (
              <>
                <BreadcrumbItem>Create Repository</BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-20 py-10">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    autoFocus
                    placeholder="Enter the title for this repository..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Choose a clear, descriptive title that reflects the purpose of
                  your repository.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => {
              const MAX_LENGTH = 300;
              const remainingChars = MAX_LENGTH - (field.value?.length || 0);
              return (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a description..."
                      maxLength={MAX_LENGTH}
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
                    <br />
                    Provide a clear and concise summary of your repository.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormItem className="flex items-center gap-3">
                      <FormControl>
                        <RadioGroupItem value="private" />
                      </FormControl>
                      <FormLabel>Private</FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center gap-3">
                      <FormControl>
                        <RadioGroupItem value="public" />
                      </FormControl>
                      <FormLabel>Public</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormDescription>
                  If you choose <b>Public</b>, anyone can see your repository.
                  If you choose <b>Private</b>, only you can see it.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending
              ? isEditMode
                ? "Saving..."
                : "Creating..."
              : isEditMode
              ? "Save Changes"
              : "Create Repo"}
          </Button>
        </form>
      </Form>
    </>
  );
}
