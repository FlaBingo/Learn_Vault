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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function NewRepoForm() {
  const form = useForm<z.infer<typeof newRepoSchema>>({
    resolver: zodResolver(newRepoSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "private",
    },
  });


  async function onSubmit(values: z.infer<typeof newRepoSchema>) {
    // create repo logic
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter the Title for this repository..." {...field} />
              </FormControl>
                <FormDescription>
                Choose a clear, descriptive title that reflects the purpose of your repository.
                </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField 
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter a description..."
                  // rows={40} don't know why it has no effect
                  maxLength={200}
                  {...field}
                />
              </FormControl>
                <FormDescription>
                Up to 200 characters.<br />
                Provide a clear and concise summary of your repository.
                </FormDescription>
              <FormMessage />
            </FormItem>
          )}
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
                      <RadioGroupItem value="private"/>
                    </FormControl>
                    <FormLabel>Private</FormLabel>
                  </FormItem>

                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <RadioGroupItem value="public"/>
                    </FormControl>
                    <FormLabel>Public</FormLabel>
                  </FormItem>

                </RadioGroup>
              </FormControl>
              <FormDescription>
                If you choose <b>Public</b>, anyone can see your repository. If you choose <b>Private</b>, only you can see it.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
