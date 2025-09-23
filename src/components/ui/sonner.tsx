import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-txt group-[.toaster]:border-line group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-txt-2",
          actionButton: "group-[.toast]:bg-accent group-[.toast]:text-accent-ink",
          cancelButton: "group-[.toast]:bg-surface group-[.toast]:text-txt-3",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
