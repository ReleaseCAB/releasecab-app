import { useEffect, useRef } from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

export const AlertMessage = ({ message, type, title }) => {
  const alertRef = useRef(null);

  useEffect(() => {
    if (alertRef.current) {
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  return (
    <Alert status={type} ref={alertRef}>
      <AlertIcon />
      <AlertTitle>{title}:</AlertTitle>
      <AlertDescription>
        <span dangerouslySetInnerHTML={{ __html: message }} />
      </AlertDescription>
    </Alert>
  );
};
