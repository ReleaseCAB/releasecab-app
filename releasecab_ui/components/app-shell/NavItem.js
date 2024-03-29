import { Box, HStack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { BsCaretRightFill } from "react-icons/bs";

export const NavItem = (props) => {
  const { active, subtle, icon, children, label, endElement, href } = props;
  return (
    <HStack
      w="full"
      px="3"
      py="2"
      cursor="pointer"
      userSelect="none"
      rounded="md"
      transition="all 0.2s"
      bg={active ? "gray.700" : undefined}
      _hover={{
        bg: "gray.700",
      }}
      _active={{
        bg: "gray.600",
      }}
    >
      <Box fontSize="lg" color={active ? "currentcolor" : "gray.400"}>
        {icon}
      </Box>
      <Box
        flex="1"
        fontWeight="inherit"
        color={subtle ? "gray.400" : undefined}
      >
        <Link href={href} passHref>
          <Text>{label}</Text>
        </Link>
      </Box>
      {endElement && !children && <Box>{endElement}</Box>}
      {children && <Box fontSize="xs" flexShrink={0} as={BsCaretRightFill} />}
    </HStack>
  );
};
