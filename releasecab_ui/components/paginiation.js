import {
  Pagination as ArkPagination,
  PaginationEllipsis,
  PaginationNextPageTrigger,
  PaginationPageTrigger,
  PaginationPrevPageTrigger,
} from "@ark-ui/react";
import {
  Button,
  Center,
  IconButton,
  List,
  ListItem,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

export const Pagination = (props) => {
  const { setPage, ...remainingProps } = props;
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });
  return (
    <ArkPagination {...remainingProps}>
      {({ pages, page }) => (
        <List display="flex" justifyContent="space-between">
          <ListItem>
            <PaginationPrevPageTrigger asChild>
              <IconButton
                variant="secondary"
                isRound
                icon={<FiArrowLeft />}
                aria-label="Previous Page"
              />
            </PaginationPrevPageTrigger>
          </ListItem>

          <List
            display={{
              base: "none",
              md: "flex",
            }}
            gap="1"
          >
            {pages.map((page, index) =>
              page.type === "page" ? (
                <ListItem key={index}>
                  <PaginationPageTrigger asChild {...page}>
                    <Button
                      variant="secondary"
                      borderRadius="full"
                      _selected={{
                        bg: "gray.50",
                        _dark: {
                          bg: "gray.800",
                        },
                      }}
                      onClick={() => props.setPage(page.value)}
                    >
                      {page.value}
                    </Button>
                  </PaginationPageTrigger>
                </ListItem>
              ) : (
                <ListItem key={index} alignItems="center" display="flex">
                  <PaginationEllipsis index={index}>
                    <Button
                      variant="secondary"
                      borderRadius="full"
                      pointerEvents="none"
                      width="10"
                    >
                      &#8230;
                    </Button>
                  </PaginationEllipsis>
                </ListItem>
              ),
            )}
          </List>
          <ListItem
            as={Center}
            display={{
              md: "none",
            }}
          >
            <Text fontWeight="medium" color="fg.emphasized">
              Page {page} of {pages.length + 1}
            </Text>
          </ListItem>

          <ListItem>
            <PaginationNextPageTrigger asChild>
              <IconButton
                variant="secondary"
                isRound
                icon={<FiArrowRight />}
                aria-label="Next Page"
              />
            </PaginationNextPageTrigger>
          </ListItem>
        </List>
      )}
    </ArkPagination>
  );
};
