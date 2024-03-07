import {
  Box,
  Container,
  Divider,
  Flex,
  Heading,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { GetReleaseSearch } from "@services/ReleaseApi";
import { useRouter } from "next/router";
import { useState } from "react";
import { BreadcrumbComponent } from "./Breadcrumb";

export const Header = (props) => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showSearchBox } = props;
  const router = useRouter();

  const handleSearch = async (e) => {
    setSearchText(e);
    if (e && e.length > 2 && !loading) {
      setLoading(true);
      const response = await GetReleaseSearch(e);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      }
    } else {
      setSearchResults([]);
    }
    setLoading(false);
  };

  const routeToResult = (result) => {
    if (result == "No Releases Found") {
      return;
    }
    const identifier = result.split(" - ")[0];
    router.push("/release/" + identifier);
  };

  return (
    <>
      <Box as="header" bg="gray.200" borderRadius="md" py={4} px={8}>
        <Container
          maxW="container.xl"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack spacing="1" align="flex-start">
            <Heading size="lg" color="black" textAlign="left">
              {props.title}
            </Heading>
            <Text fontSize="sm" color="gray.500" textAlign="left">
              {props.secondaryTitle}
            </Text>
          </Stack>
          {showSearchBox === "true" && (
            <Flex align="center">
              <Flex align="center" position="relative">
                <Input
                  placeholder="Search Releases"
                  variant="outline"
                  size="sm"
                  maxWidth="md"
                  mr={2}
                  borderColor="gray.300"
                  borderRadius="md"
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
                {loading && (
                  <Spinner
                    size="sm"
                    color="gray.500"
                    position="absolute"
                    right="8px"
                    transform="translateY(-50%)"
                  />
                )}
              </Flex>
              <Menu isOpen={searchResults.length > 0}>
                <MenuButton></MenuButton>
                <MenuList>
                  {searchResults.map((result) => (
                    <MenuItem
                      key={result}
                      onClick={() => routeToResult(result)}
                    >
                      {result}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Flex>
          )}
        </Container>
        <Divider mt={4} />
      </Box>
      <Flex ml={5} mt={3}>
        {props.crumbs && (
          <BreadcrumbComponent crumbs={props.crumbs}></BreadcrumbComponent>
        )}
      </Flex>
    </>
  );
};
