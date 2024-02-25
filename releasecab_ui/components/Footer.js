import {
  Box,
  ButtonGroup,
  Container,
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
            <Link
              href="https://github.com/ReleaseCAB/releasecab-app"
              isExternal
            >
              <FaGithub size={25} />
            </Link>
            <Link href="https://www.buymeacoffee.com/releasecab" isExternal>
              <FaCoffee size={25} />
            </Link>
          </ButtonGroup>
        </Stack>
        <Text fontSize="sm" color="brand.gray_text">
          &copy; {new Date().getFullYear()} Release CAB. This project is open
          source under the{" "}
          <Link
            href="https://github.com/ReleaseCAB/releasecab-app/blob/main/LICENSE"
            isExternal
            color="brand.link_blue"
          >
            GNU General Public License v3.0.
          </Link>
        </Text>
      </Stack>
    </Container>
  </Box>
);

export default Footer;
