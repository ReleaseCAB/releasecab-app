import {
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
  useMergeRefs,
} from "@chakra-ui/react";
import { forwardRef, useRef } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

export const PasswordField = forwardRef(
  ({ password, setPassword, ...props }, ref) => {
    const { isOpen, onToggle } = useDisclosure();
    const inputRef = useRef(null);
    const mergeRef = useMergeRefs(inputRef, ref);
    const onClickReveal = () => {
      onToggle();
      if (inputRef.current) {
        inputRef.current.focus({
          preventScroll: true,
        });
      }
    };
    return (
      <FormControl>
        {props.showheader == "true" && (
          <FormLabel htmlFor="password">Password</FormLabel>
        )}
        <InputGroup>
          <Input
            id="password"
            ref={mergeRef}
            name="password"
            type={isOpen ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            {...props}
          />
          <InputRightElement>
            <IconButton
              variant="text"
              aria-label={isOpen ? "Mask password" : "Reveal password"}
              icon={isOpen ? <HiEyeOff /> : <HiEye />}
              onClick={onClickReveal}
            />
          </InputRightElement>
        </InputGroup>
      </FormControl>
    );
  },
);

PasswordField.displayName = "PasswordField";
