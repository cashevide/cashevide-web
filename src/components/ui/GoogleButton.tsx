import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

import { Button } from "./Button";

interface GoogleButtonProps {
  onCredential: (credentialResponse: CredentialResponse) => void;
}

// Google's official 4-color "G" mark — same SVG paths used in Expo's
// GoogleButton.tsx, ported as plain SVG.
function GoogleLogo() {
  return (
    <svg width={18} height={18} viewBox="0 0 48 48">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.9-2.26 5.36-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

// Custom-look, real-Google-behavior button: our own Button renders
// visually (exact design-system styling, dark/light theme, radius,
// icon), while Google's actual GoogleLogin button sits directly on
// top of it at 0 opacity. A click always lands on the real Google
// button underneath — this is a genuine click passing through the
// DOM stack, not a simulated/dispatched click event — so it keeps
// Google's real ID-token flow (popup, FedCM, etc.) working exactly
// as it does when GoogleLogin is visible.
export function GoogleButton({ onCredential }: GoogleButtonProps) {
  return (
    <div className="relative w-full">
      <Button
        variant="outline"
        title="Continue with Google"
        leftIcon={<GoogleLogo />}
        fullWidth
        // Purely visual — the real click target is the invisible
        // Google button positioned exactly on top of this one.
        tabIndex={-1}
        aria-hidden="true"
      />

      <div className="absolute inset-0 opacity-0 overflow-hidden">
        <GoogleLogin
          onSuccess={onCredential}
          onError={() => {
            console.error("Google sign-in failed");
          }}
          size="large"
          width="100%"
        />
      </div>
    </div>
  );
}
