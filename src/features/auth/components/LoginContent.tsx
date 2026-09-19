import { useState } from "react";
import { useNavigate } from "react-router";

import { Container } from "../../../components/layout/Container";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { GoogleButton } from "../../../components/ui/GoogleButton";
import { Divider } from "../../../components/ui/Divider";
import { useLogin } from "../hooks/useLogin";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import { ROUTES } from "../../../lib/routes";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginContent() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const loginMutation = useLogin();
  const { handleGoogleCredential } = useGoogleAuth();

  const trimmedEmail = email.trim();
  const isEmailValid =
    trimmedEmail.length === 0 || EMAIL_REGEX.test(trimmedEmail);
  const emailError =
    emailTouched && !isEmailValid ? "Enter a valid email address." : undefined;

  function handleLogin() {
    if (!isEmailValid || trimmedEmail.length === 0) {
      setEmailTouched(true);
      return;
    }

    loginMutation.mutate({
      email: trimmedEmail,
      password,
    });
  }

  return (
    <Container variant="narrow" scroll>
      <div className="flex-1 flex flex-col justify-center px-6 py-10 gap-8">
        <Text variant="subheading" className="text-center">
          Log in to your account
        </Text>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailTouched(false)}
              onBlur={() => setEmailTouched(true)}
              placeholder="Email"
              type="email"
              error={emailError}
            />

            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
              placeholder="Password"
              isPassword
              error={
                loginMutation.isError
                  ? "Login failed. Please check your email and password."
                  : undefined
              }
            />
          </div>

          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => navigate(ROUTES.passwordReset.entry)}
            >
              <Text variant="link">Forgot password?</Text>
            </button>
          </div>

          <Button
            variant="primary"
            title="Log in"
            onClick={handleLogin}
            isLoading={loginMutation.isPending}
            fullWidth
          />

          <Divider label="or" />

          <GoogleButton onCredential={handleGoogleCredential} />
        </div>
      </div>
    </Container>
  );
}
