import { Button } from "../../components/ui/Button";
import { useLogout } from "../../features/auth/hooks/useLogout";

export function SettingsRoute() {
  const logoutMutation = useLogout();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-background text-foreground">
      <p className="text-lg">Settings (placeholder)</p>
      <Button
        variant="outline"
        title="Log out"
        onClick={() => logoutMutation.mutate()}
        isLoading={logoutMutation.isPending}
      />
    </div>
  );
}
