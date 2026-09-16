import { useNavigate, useSearchParams } from "react-router";
import { Mail } from "lucide-react";

import { Container } from "../../../components/layout/Container";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { GoogleButton } from "../../../components/ui/GoogleButton";
import { Divider } from "../../../components/ui/Divider";
import { Logo } from "../../../components/ui/Logo";
import { Spinner } from "../../../components/ui/Spinner";
import { useGoogleAuth } from "../../auth/hooks/useGoogleAuth";
import { ROUTES } from "../../../lib/routes";

export function WelcomeContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { handleGoogleCredential, isPending } = useGoogleAuth();

  // Referral deep links (e.g. shared from the Invite Friends dialog)
  // land here first, since this is the very first signup screen —
  // Google sign-in reads ?referral= itself inside useGoogleAuth, but
  // "Continue with Email" is a plain navigate() with no query string
  // of its own, so it needs the code forwarded explicitly here.
  const referralCode = searchParams.get("referral");

  function handleContinueWithEmail() {
    navigate(
      referralCode
        ? `${ROUTES.signup.referral}?referral=${encodeURIComponent(referralCode)}`
        : ROUTES.signup.referral,
    );
  }

  if (isPending) {
    return (
      <Container variant="narrow">
        <div className="flex-1 flex items-center justify-center">
          <Spinner />
        </div>
      </Container>
    );
  }

  return (
    <Container variant="narrow">
      <div className="flex-1 sm:justify-center flex flex-col px-6 pb-16 sm:pb-0 pt-16 sm:py-0">
        <div className="flex-1 sm:flex-none flex flex-col items-center justify-center sm:justify-start gap-4">
          <Logo width={64} />
          <Text variant="subheading" className="text-center">
            Never work blind again.
          </Text>
        </div>

        <div className="flex flex-col gap-6 sm:mt-10">
          <div className="flex flex-col gap-4">
            <GoogleButton onCredential={handleGoogleCredential} />

            <Divider label="or" />

            <Button
              variant="primary"
              title="Continue with Email"
              leftIcon={<Mail size={20} />}
              onClick={handleContinueWithEmail}
              fullWidth
            />
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-col items-center gap-1">
              <Text variant="caption" className="text-center">
                By continuing, you agree to Cashevide's
              </Text>
              <div className="flex flex-row items-baseline gap-1">
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.legal.terms)}
                >
                  <Text variant="caption" className="text-link">
                    Terms
                  </Text>
                </button>
                <Text variant="caption">and</Text>
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.legal.privacyPolicy)}
                >
                  <Text variant="caption" className="text-link">
                    Privacy Policy
                  </Text>
                </button>
              </div>
            </div>

            <div className="flex flex-row items-center gap-1">
              <Text variant="body-sm">Already have an account?</Text>
              <button type="button" onClick={() => navigate(ROUTES.login)}>
                <Text variant="body" className="text-link">
                  Log in
                </Text>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
