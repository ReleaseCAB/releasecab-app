import React from "react";
import { Box, Container, Stack } from "@chakra-ui/react";
import { Step } from "./Step";
import { useStep } from "./UseStep";

export const Progress = ({ stepObj }) => {
  const [currentStep, { setStep, goToNextStep, goToPrevStep }] = useStep({
    maxStep: stepObj.length - 1,
    initialStep: 0,
  });

  const progressJsx = (
    <Box>
      <Container py={{ base: "4", md: "8" }} maxW="none">
        <Stack spacing="0" direction={{ base: "column", md: "row" }}>
          {stepObj.map((step, id) => (
            <Step
              key={id}
              title={step.title}
              description={stepObj.description}
              isactive={currentStep === id ? "true" : "false"}
              iscompleted={currentStep > id ? "true" : "false"}
              isFirstStep={id === 0}
              isLastStep={stepObj.length === id + 1}
            />
          ))}
        </Stack>
      </Container>
    </Box>
  );

  return { currentStep, progressJsx, goToNextStep, goToPrevStep };
};
