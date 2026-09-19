import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { Container } from "../../../components/layout/Container";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Spinner } from "../../../components/ui/Spinner";
import { ReferralRequestModal } from "./ReferralRequestModal";
import { useCheckReferralCode } from "../hooks/useCheckReferralCode";
import { useSignupStore } from "../../../stores/signupStore";
import { ROUTES } from "../../../lib/routes";

export function ReferralCodeContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Deep-link support: a link like /signup/referral?referral=CODE123
  // (e.g. shared from the Invite Friends dialog) pre-fills the code
  // from the URL. The user still sees it land in the input — this is
  // deliberately not a silent skip-the-screen redirect, since a wrong
  // or expired code needs the normal error UI, not a bounce back here
  // after already having moved on to the email step.
  const [referralCode, setReferralCode] = useState(
    () => searchParams.get("referral")?.trim().toUpperCase() ?? "",
  );
  const [requestModalVisible, setRequestModalVisible] = useState(false);

  // Guards against re-firing the auto-navigate once the user has
  // already been moved forward — without this, coming back to this
  // screen (e.g. via the browser back button) with the same ?referral=
  // URL still in the address bar would immediately bounce them
  // forward again the moment validation resolves.
  const hasAutoNavigatedRef = useRef(false);

  const setReferralCodeInput = useSignupStore(
    (state) => state.setReferralCodeInput,
  );

  const referralCheck = useCheckReferralCode(referralCode);

  function handleContinue() {
    setReferralCodeInput(referralCode.trim());
    navigate(ROUTES.signup.email);
  }

  // Only auto-advances when the code came from the URL, not when the
  // user is mid-typing their own code — otherwise finishing a valid
  // code by hand would yank them to the next screen before they get a
  // chance to notice the success message or use "Get one" instead.
  const cameFromDeepLink = searchParams.has("referral");

  useEffect(() => {
    if (
      cameFromDeepLink &&
      !hasAutoNavigatedRef.current &&
      referralCheck.data?.is_valid === true
    ) {
      hasAutoNavigatedRef.current = true;
      handleContinue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameFromDeepLink, referralCheck.data?.is_valid]);

  const canContinue = referralCheck.data?.is_valid === true;

  const referralCheckMessage = referralCheck.data
    ? {
        text: referralCheck.data.message,
        isSuccess: referralCheck.data.is_valid,
      }
    : null;

  return (
    <>
      <Container variant="narrow" scroll>
        <div className="flex-1 flex flex-col justify-center px-6 py-10 gap-8">
          <Text variant="subheading" className="text-center">
            Enter your referral code
          </Text>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Input
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && canContinue) {
                    handleContinue();
                  }
                }}
                placeholder="Referral Code"
                isSuccess={referralCheckMessage?.isSuccess}
                error={
                  referralCheckMessage && !referralCheckMessage.isSuccess
                    ? referralCheckMessage.text
                    : undefined
                }
              />

              {referralCheck.isFetching ? (
                <div className="flex items-center justify-center">
                  <Spinner size="sm" />
                </div>
              ) : null}

              {referralCheckMessage?.isSuccess ? (
                <Text
                  variant="body-sm"
                  className="text-success-text text-center"
                >
                  {referralCheckMessage.text}
                </Text>
              ) : null}
            </div>

            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => setRequestModalVisible(true)}
              >
                <Text variant="link">Don't have a referral code? Get one</Text>
              </button>
            </div>

            <div className="flex items-center justify-center">
              <Button
                variant="primary"
                title="Continue"
                onClick={handleContinue}
                disabled={!canContinue}
              />
            </div>
          </div>
        </div>
      </Container>

      <ReferralRequestModal
        visible={requestModalVisible}
        onDismiss={() => setRequestModalVisible(false)}
      />
    </>
  );
}
