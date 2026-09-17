import { useState } from "react";

import { Avatar } from "../../../components/ui/Avatar";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { Text } from "../../../components/ui/Text";
import { useMalayaliModeStore } from "../../../stores/malayaliModeStore";
import { useOnboardingPromptStore } from "../../../stores/onboardingPromptStore";

// The prompt walks through a small set of fixed steps. "dhamu-question" is
// always first. From there the flow branches:
//   - answering "No" (doesn't know Dhamu/Vasu) goes straight to
//     "closing-not-malayali" and mode stays OFF, no mode question asked.
//   - answering "Yes" goes to "mode-question", and whichever answer is
//     given there sets the mode accordingly and closes the prompt
//     immediately — no separate closing step.
type PromptStep = "dhamu-question" | "mode-question" | "closing-not-malayali";

type MalayaliModePromptProps = {
  visible: boolean;
  onComplete: () => void;
};

export function MalayaliModePrompt({
  visible,
  onComplete,
}: MalayaliModePromptProps) {
  const [step, setStep] = useState<PromptStep>("dhamu-question");
  const setMalayaliMode = useMalayaliModeStore(
    (state) => state.setMalayaliMode,
  );
  const setHasSeenMalayaliPrompt = useOnboardingPromptStore(
    (state) => state.setHasSeenMalayaliPrompt,
  );

  function finish() {
    // Marking the prompt as seen happens once, right before the whole
    // flow closes, regardless of which branch the user took. The step is
    // intentionally not reset here — this component unmounts once
    // `onComplete` flips `visible` to false on the parent, so there is no
    // stale state to worry about on a future mount (a fresh mount only
    // happens on next app run, which starts a fresh instance).
    setHasSeenMalayaliPrompt(true);
    onComplete();
  }

  function handleKnowsDhamu(knows: boolean) {
    if (knows) {
      setStep("mode-question");
    } else {
      setStep("closing-not-malayali");
    }
  }

  function handleModeAnswer(wantsMode: boolean) {
    setMalayaliMode(wantsMode);
    finish();
  }

  if (step === "dhamu-question") {
    return (
      <Modal
        visible={visible}
        dismissible={false}
        className="text-center py-6"
        description={
          <div className="flex flex-col gap-2">
            <div className="max-w-[260px] mx-auto">
              <Text variant="body">
                Have you heard of{" "}
                <Text as="span" variant="body-lg" className="font-semibold">
                  Dashamoolam Dhamu
                </Text>{" "}
                or{" "}
                <Text as="span" variant="body-lg" className="font-semibold">
                  Vasu Annan
                </Text>{" "}
                before?
              </Text>
            </div>
          </div>
        }
        footer={
          <div className="flex flex-col gap-2">
            <Button
              variant="primary"
              size="sm"
              fullWidth
              title="Yes, of course"
              onClick={() => handleKnowsDhamu(true)}
            />
            <Button
              variant="outline"
              size="sm"
              fullWidth
              title="Don't know"
              onClick={() => handleKnowsDhamu(false)}
            />
          </div>
        }
      >
        <div className="flex flex-row justify-center gap-6 py-2">
          <Avatar
            imageUri="/images/memes/dashamoolam-dhamu.jpg"
            name="Dashamoolam Dhamu"
            size={112}
          />
          <Avatar
            imageUri="/images/memes/vasu-annan.jpg"
            name="Vasu Annan"
            size={112}
          />
        </div>
      </Modal>
    );
  }

  if (step === "mode-question") {
    return (
      <Modal
        visible={visible}
        dismissible={false}
        className="text-center py-6"
        footer={
          <div className="flex flex-col gap-2">
            <Button
              variant="primary"
              size="sm"
              fullWidth
              title="Yes"
              onClick={() => handleModeAnswer(true)}
            />
            <Button
              variant="outline"
              size="sm"
              fullWidth
              title="No"
              onClick={() => handleModeAnswer(false)}
            />
          </div>
        }
      >
        <div className="flex flex-row justify-center py-2">
          <Avatar
            imageUri="/images/memes/enke-pathalum-nee.jpg"
            name="Enke Pathalum Nee"
            size={112}
          />
        </div>
        <div className="max-w-[340px] mx-auto">
          <Text variant="body-lg" className="font-semibold" malayalam>
            എങ്കെ പാത്താലും മലയാളി...
            <br />
            ആപ്പിൽ ഒരു മലയാളി mode ഉണ്ട്. on ആക്കണോ? (app language change
            ആക്കുന്നതല്ല. Funny mode. off ആക്കണം എങ്കിൽ settings ഇൽ പോയി off
            ആക്കാം)
          </Text>
        </div>
      </Modal>
    );
  }

  // step === "closing-not-malayali"
  return (
    <Modal
      visible={visible}
      dismissible={false}
      className="text-center"
      title="No problem, it was a simple test to know you and the developer from same place. Start your journey."
      footer={
        <div className="flex flex-col gap-2">
          <Button
            variant="primary"
            size="sm"
            fullWidth
            title="Start your journey"
            onClick={finish}
          />
        </div>
      }
    />
  );
}
