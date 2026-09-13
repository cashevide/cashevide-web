import { ArrowRight, Trash2, X } from "lucide-react";

import { Container } from "../../../../components/layout/Container";
import { Text } from "../../../../components/ui/Text";
import { Button } from "../../../../components/ui/Button";
import { GoogleButton } from "../../../../components/ui/GoogleButton";

const BUTTON_VARIANTS = [
  "primary",
  "secondary",
  "brand",
  "success",
  "destructive",
  "outline",
  "ghost",
  "link",
] as const;

export function ButtonsRoute() {
  return (
    <Container variant="desktop" scroll>
      <div className="flex flex-col gap-14 py-12 px-6">
        <Text variant="title">Buttons</Text>

        {/* Variants x states */}
        <div className="flex flex-col gap-6">
          <Text variant="heading">Variants</Text>

          <div className="flex flex-col gap-1">
            {BUTTON_VARIANTS.map((variant) => (
              <div
                key={variant}
                className="flex flex-col gap-3 md:flex-row md:items-center md:gap-8 border-b border-border py-5"
              >
                <Text
                  variant="caption"
                  className="md:w-24 md:shrink-0 text-muted-foreground"
                >
                  {variant}
                </Text>

                <div className="flex flex-row flex-wrap items-center gap-3">
                  <Button variant={variant} title="Button" />
                  <Button variant={variant} title="Loading" isLoading />
                  <Button variant={variant} title="Disabled" disabled />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Icons */}
        <div className="flex flex-col gap-6">
          <Text variant="heading">With Icons</Text>

          <div className="flex flex-row flex-wrap items-center gap-4 border-b border-border py-5">
            <Button
              variant="primary"
              title="Continue"
              rightIcon={<ArrowRight size={18} />}
            />
            <Button
              variant="destructive"
              title="Delete"
              leftIcon={<Trash2 size={18} />}
            />
            <Button
              variant="outline"
              title="Next"
              rightIcon={<ArrowRight size={18} />}
            />
          </div>
        </div>

        {/* Sizes */}
        <div className="flex flex-col gap-6">
          <Text variant="heading">Sizes</Text>

          <div className="flex flex-row flex-wrap items-center gap-4 border-b border-border py-5">
            <Button variant="primary" size="sm" title="Small" />
            <Button variant="primary" size="default" title="Default" />
            <Button variant="primary" size="lg" title="Large" />
          </div>
        </div>

        {/* Icon-only */}
        <div className="flex flex-col gap-6">
          <Text variant="heading">Icon Only</Text>

          <div className="flex flex-col gap-1">
            {BUTTON_VARIANTS.map((variant) => (
              <div
                key={variant}
                className="flex flex-col gap-3 md:flex-row md:items-center md:gap-8 border-b border-border py-5"
              >
                <Text
                  variant="caption"
                  className="md:w-24 md:shrink-0 text-muted-foreground"
                >
                  {variant}
                </Text>

                <div className="flex flex-row flex-wrap items-center gap-3">
                  <Button
                    size="icon"
                    variant={variant}
                    icon={<X size={20} />}
                    aria-label="Close"
                  />
                  <Button
                    size="icon"
                    variant={variant}
                    icon={<X size={20} />}
                    aria-label="Close"
                    isLoading
                  />
                  <Button
                    size="icon"
                    variant={variant}
                    icon={<X size={20} />}
                    aria-label="Close"
                    disabled
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Google Button */}
        <div className="flex flex-col gap-6">
          <Text variant="heading">Google Button</Text>

          <div className="flex flex-col gap-3 max-w-[400px] py-5">
            <GoogleButton onCredential={() => {}} />
          </div>
        </div>

        {/* Full width */}
        <div className="flex flex-col gap-6">
          <Text variant="heading">Full Width</Text>

          <div className="flex flex-col gap-3 py-5">
            <Button variant="primary" title="Continue with Email" fullWidth />
            <GoogleButton onCredential={() => {}} />
          </div>
        </div>
      </div>
    </Container>
  );
}
