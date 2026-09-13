import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

import { useThemeStore } from "../../stores/themeStore";

interface GoogleButtonProps {
  onCredential: (credentialResponse: CredentialResponse) => void;
}

export function GoogleButton({ onCredential }: GoogleButtonProps) {
  const theme = useThemeStore((state) => state.theme);

  return (
    <GoogleLogin
      onSuccess={onCredential}
      onError={() => {
        console.error("Google sign-in failed");
      }}
      theme={theme === "dark" ? "filled_black" : "outline"}
      size="large"
      width="100%"
      text="continue_with"
    />
  );
}
