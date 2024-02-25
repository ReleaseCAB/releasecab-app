import { Circle, Icon } from "@chakra-ui/react";
import { HiCheck } from "react-icons/hi";

export const StepCircle = (props) => {
  const { iscompleted, isactive } = props;
  return (
    <Circle
      size="8"
      bg={iscompleted == "true" ? "brand.secondary_blue" : "inherit"}
      borderWidth={iscompleted == "true" ? "0" : "2px"}
      borderColor={isactive ? "brand.secondary_blue" : "inherit"}
      {...props}
    >
      {iscompleted == "true" ? (
        <Icon as={HiCheck} color="fg.inverted" boxSize="5" />
      ) : (
        <Circle
          bg={isactive == "true" ? "brand.secondary_blue" : "border"}
          size="3"
        />
      )}
    </Circle>
  );
};
