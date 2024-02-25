import {
  Box,
  ButtonGroup,
  Container,
  IconButton,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaCoffee, FaGithub } from "react-icons/fa";
import { Logo } from "./Logo";

const Footer = () => (
  <Box bg="brand.gray_bg" color="brand.black_text">
    <Container as="footer" role="contentinfo" py={{ base: "12", md: "16" }}>
      <Stack spacing={{ base: "4", md: "5" }}>
        <Stack justify="space-between" direction="row" align="center">
          <Logo />
          <ButtonGroup variant="tertiary.accent">
            <IconButton
              as="a"
              href="#"
              aria-label="GitHub"
              icon={<FaGithub fontSize="1.25rem" />}
            />
            <IconButton
              as="a"
              href="#"
              aria-label="Coffee"
              icon={<FaCoffee fontSize="1.25rem" />}
            />
          </ButtonGroup>
        </Stack>
        <Text fontSize="sm" color="brand.gray_text">
          Want to support our development? Click{" "}
          <Link color="brand.link_blue">here</Link> to learn more!
        </Text>
        <Text fontSize="sm" color="brand.gray_text">
          &copy; {new Date().getFullYear()} Release CAB. This project is open
          source under the [License Name].
        </Text>
      </Stack>
    </Container>
  </Box>
);

export default Footer;
