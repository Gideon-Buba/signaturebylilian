import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/AdminShell";
import { Switch } from "@/components/ui/switch";
import { requireAdminForRoute } from "@/lib/auth/routeGuard";
import { getSiteSettingsFn, updateSiteSettingsFn, type SiteSettings } from "@/server-fns/settings";

export const Route = createFileRoute("/admin/settings/")({
  head: () => ({
    meta: [{ title: "Settings — Admin — Signature by Lilian" }],
  }),
  beforeLoad: requireAdminForRoute,
  component: SettingsPage,
});

const SETTINGS_QUERY_KEY = ["admin", "site-settings"] as const;

function SettingsPage() {
  const { user } = Route.useRouteContext();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: () => getSiteSettingsFn(),
  });

  const mutation = useMutation({
    mutationFn: (next: SiteSettings) => updateSiteSettingsFn({ data: next }),
    onMutate: async (next) => {
      await queryClient.cancelQueries({ queryKey: SETTINGS_QUERY_KEY });
      const previous = queryClient.getQueryData<SiteSettings>(SETTINGS_QUERY_KEY);
      queryClient.setQueryData(SETTINGS_QUERY_KEY, next);
      return { previous };
    },
    onError: (err: Error, _next, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(SETTINGS_QUERY_KEY, ctx.previous);
      toast.error(err.message);
    },
    onSuccess: () => toast.success("Settings saved"),
    onSettled: () => queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY }),
  });

  const toggle = (key: keyof SiteSettings) => {
    if (!settings) return;
    const next = { ...settings, [key]: !settings[key] };
    if (!next.payOnlineEnabled && !next.bankTransferEnabled) {
      toast.error("At least one payment method has to stay on.");
      return;
    }
    mutation.mutate(next);
  };

  return (
    <AdminShell user={user} title="Settings">
      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

      {settings && (
        <div className="max-w-xl">
          <section>
            <h2 className="font-serif text-xl text-foreground">Payment methods</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose which ways customers can pay at checkout. At least one must stay on.
            </p>

            <div className="mt-6 divide-y divide-border border-y border-border">
              <SettingRow
                label="Pay online"
                description="Card and bank transfer through Echezona's hosted checkout."
                checked={settings.payOnlineEnabled}
                disabled={mutation.isPending}
                onCheckedChange={() => toggle("payOnlineEnabled")}
              />
              <SettingRow
                label="Arrange payment another way"
                description="Shows your bank details and a WhatsApp button for manual transfers."
                checked={settings.bankTransferEnabled}
                disabled={mutation.isPending}
                onCheckedChange={() => toggle("bankTransferEnabled")}
              />
            </div>
          </section>
        </div>
      )}
    </AdminShell>
  );
}

function SettingRow({
  label,
  description,
  checked,
  disabled,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled: boolean;
  onCheckedChange: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-5">
      <div className="min-w-0">
        <p className="text-sm text-foreground">{label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        aria-label={label}
        className="mt-0.5 shrink-0"
      />
    </div>
  );
}
