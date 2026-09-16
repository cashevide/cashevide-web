import { useEffect, useRef, useState } from "react";
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
//
// pointer-events-none on the visible Button is required — without it,
// the visible layer (being on top in paint order even though it's
// rendered first in markup — the overlay div comes after it and is
// stacked above) intercepts the click itself and it never reaches the
// real, invisible Google button underneath.
//
// KNOWN LIBRARY LIMITATION (react-oauth/google#350): GoogleLogin's
// width="100%" only applies on the very first render — Google's GSI
// script then re-measures and collapses the real iframe/button down
// to its own intrinsic (much narrower) width, regardless of the
// width prop or the wrapping container's actual size. Because the
// invisible real button no longer fills wrapWidthRef's box, only the
// sliver of empty space it still occupies is genuinely clickable —
// which happens to line up with where our visible icon sits, hence
// "only the icon area is clickable".
//
// Fix: measure the real button's actual rendered width after Google
// finishes shrinking it, then CSS-scale that narrow element back up
// to fill the wrapper. transform: scale() (unlike resizing width)
// stretches the whole interactive hit area along with the visuals,
// so the enlarged invisible click target now spans the same area as
// our visible full-width Button — while the pixels a click actually
// lands on are still Google's own real button, keeping its native ID
// token flow (popup, FedCM, etc.) intact.
export function GoogleButton({ onCredential }: GoogleButtonProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const realBtnRef = useRef<HTMLDivElement>(null);
  const [scaleX, setScaleX] = useState(1);

  useEffect(() => {
    const wrapEl = wrapRef.current;
    const realBtnEl = realBtnRef.current;
    if (!wrapEl || !realBtnEl) return;

    // Recompute whenever either box's size changes — the wrapper
    // resizes with the viewport/layout, and Google's real button
    // resizes (usually once, from its initial 100% down to its
    // intrinsic width) after its script finishes loading.
    const recompute = () => {
      const wrapWidth = wrapEl.offsetWidth;
      const realBtnWidth = realBtnEl.offsetWidth;
      if (wrapWidth > 0 && realBtnWidth > 0) {
        setScaleX(wrapWidth / realBtnWidth);
      }
    };

    recompute();

    const observer = new ResizeObserver(recompute);
    observer.observe(wrapEl);
    observer.observe(realBtnEl);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="relative w-full">
      <div className="pointer-events-none">
        <Button
          variant="outline"
          title="Continue with Google"
          leftIcon={<GoogleLogo />}
          fullWidth
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>

      <div className="absolute inset-0 opacity-0 overflow-hidden">
        <div
          ref={realBtnRef}
          // Scaling from the left edge keeps the stretched click
          // target aligned with the wrapper's left edge (where it
          // starts), rather than growing out from the center.
          style={{ transform: `scaleX(${scaleX})`, transformOrigin: "left" }}
          className="inline-block"
        >
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
    </div>
  );
}
