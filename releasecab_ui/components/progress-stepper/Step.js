import { Divider, Stack, Text, useBreakpointValue } from "@chakra-ui/react";
import { StepCircle } from "./StepCircle";

export const Step = (props) => {
  const {
    isactive,
    iscompleted,
    isLastStep,
    isFirstStep,
    title,
    description,
    ...stackProps
  } = props;
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });
  const orientation = useBreakpointValue({
    base: "vertical",
    md: "horizontal",
  });
  return (
    <Stack
      spacing="4"
      direction={{
        base: "row",
        md: "column",
      }}
      flex="1"
      {...stackProps}
    >
      <Stack
        spacing="0"
        align="center"
        direction={{
          base: "column",
          md: "row",
        }}
      >
        <Divider
          display={isMobile ? "none" : "initial"}
          orientation={orientation}
          borderWidth="1px"
          borderColor={
            isFirstStep
              ? "transparent"
              : iscompleted == "true" || isactive == "true"
              ? "accent"
              : "inherit"
          }
        />
        <StepCircle isactive={isactive} iscompleted={iscompleted} />
        <Divider
          orientation={orientation}
          borderWidth="1px"
          borderColor={
            iscompleted == "true"
              ? "accent"
              : isLastStep
              ? "transparent"
              : "inherit"
          }
        />
      </Stack>
      <Stack
        spacing="0.5"
        pb={isMobile && !isLastStep ? "8" : "0"}
        align={{
          base: "start",
          md: "center",
        }}
      >
        <Text color="fg.emphasized" fontWeight="medium">
          {title}
        </Text>
        <Text color="fg.muted">{description}</Text>
      </Stack>
    </Stack>
  );
};
