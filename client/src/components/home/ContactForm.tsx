import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, AlertCircle } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  interest: z.string().min(1, "Please select an area of interest"),
  message: z.string().min(10, "Message is too short"),
});

export default function ContactForm() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      interest: "",
      message: "",
    },
    mode: "onChange", // Enable real-time validation
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      toast({
        title: "Success!",
        description: "Your message has been sent. We'll get back to you soon.",
        duration: 3000,
      });

      form.reset();
    } catch (error) {
      console.error("Contact form error:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <div id="contact" className="py-24 bg-slate-200 dark:bg-slate-900 border-t border-border">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12"
        >
          {t("contact.title")}
        </motion.h2>

        <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <AnimatePresence mode="wait">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("contact.name")}</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            {...field}
                            className={`transition-all duration-200 ${
                              form.formState.errors.name 
                                ? "border-red-500 focus:border-red-500" 
                                : field.value 
                                  ? "border-green-500 focus:border-green-500"
                                  : ""
                            }`}
                          />
                        </FormControl>
                        <AnimatePresence>
                          {field.value && !form.formState.errors.name && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              className="absolute right-2 top-1/2 -translate-y-1/2"
                            >
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <AnimatePresence>
                        {form.formState.errors.name && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <FormMessage />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("contact.email")}</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            type="email" 
                            {...field}
                            className={`transition-all duration-200 ${
                              form.formState.errors.email 
                                ? "border-red-500 focus:border-red-500" 
                                : field.value 
                                  ? "border-green-500 focus:border-green-500"
                                  : ""
                            }`}
                          />
                        </FormControl>
                        <AnimatePresence>
                          {field.value && !form.formState.errors.email && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              className="absolute right-2 top-1/2 -translate-y-1/2"
                            >
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <AnimatePresence>
                        {form.formState.errors.email && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <FormMessage />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("contact.phone")}</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            type="tel" 
                            {...field}
                            className={`transition-all duration-200 ${
                              form.formState.errors.phone 
                                ? "border-red-500 focus:border-red-500" 
                                : field.value 
                                  ? "border-green-500 focus:border-green-500"
                                  : ""
                            }`}
                          />
                        </FormControl>
                        <AnimatePresence>
                          {field.value && !form.formState.errors.phone && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              className="absolute right-2 top-1/2 -translate-y-1/2"
                            >
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <AnimatePresence>
                        {form.formState.errors.phone && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <FormMessage />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("contact.interest")}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className={
                            form.formState.errors.interest 
                              ? "border-red-500 focus:border-red-500" 
                              : field.value 
                                ? "border-green-500 focus:border-green-500"
                                : ""
                          }>
                            <SelectValue placeholder="Select area of interest" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="properties">{t("products.properties")}</SelectItem>
                          <SelectItem value="industrial">{t("products.industrial")}</SelectItem>
                          <SelectItem value="residential">{t("products.residential")}</SelectItem>
                          <SelectItem value="prefab">{t("products.prefab")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <AnimatePresence>
                        {form.formState.errors.interest && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <FormMessage />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("contact.message")}</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Textarea 
                            {...field}
                            className={`transition-all duration-200 ${
                              form.formState.errors.message 
                                ? "border-red-500 focus:border-red-500" 
                                : field.value 
                                  ? "border-green-500 focus:border-green-500"
                                  : ""
                            }`}
                          />
                        </FormControl>
                        <AnimatePresence>
                          {field.value && !form.formState.errors.message && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              className="absolute right-2 top-6"
                            >
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <AnimatePresence>
                        {form.formState.errors.message && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <FormMessage />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </FormItem>
                  )}
                />
              </AnimatePresence>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={!form.formState.isValid}
                >
                  {t("contact.submit")}
                </Button>
              </motion.div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}