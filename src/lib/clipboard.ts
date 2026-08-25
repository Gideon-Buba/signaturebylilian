import { toast } from "sonner";

export function copyToClipboard(value: string, label: string) {
  navigator.clipboard
    .writeText(value)
    .then(() => toast.success(`${label} copied`))
    .catch(() => toast.error(`Couldn't copy ${label.toLowerCase()}`));
}
