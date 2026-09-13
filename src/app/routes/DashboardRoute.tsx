import { Button } from "../../components/ui/Button";
import { useLogout } from "../../features/auth/hooks/useLogout";

export function DashboardRoute() {
  const logoutMutation = useLogout();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
      <p className="text-lg">Dashboard (placeholder)</p>
      <Button
        variant="outline"
        title="Log out"
        onClick={() => logoutMutation.mutate()}
        isLoading={logoutMutation.isPending}
      />
    </div>
  );
}
