import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";

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
