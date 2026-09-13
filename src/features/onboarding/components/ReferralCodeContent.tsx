import { useState } from "react";
import { useNavigate } from "react-router";

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

  const [referralCode, setReferralCode] = useState("");
  const [requestModalVisible, setRequestModalVisible] = useState(false);

  const setReferralCodeInput = useSignupStore(
    (state) => state.setReferralCodeInput,
  );

  const referralCheck = useCheckReferralCode(referralCode);

  function handleContinue() {
    setReferralCodeInput(referralCode.trim());
    navigate(ROUTES.signup.email);
  }

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
