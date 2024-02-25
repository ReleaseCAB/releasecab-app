import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BiChevronRight } from "react-icons/bi";

export const BreadcrumbComponent = (props) => {
  const router = useRouter();

  const onLink = (link) => {
    router.push(link);
  };

  return (
    <>
      <Breadcrumb spacing="8px" separator={<BiChevronRight color="gray.500" />}>
        {props.crumbs.length > 0 &&
          props.crumbs.map((crumb, index) => (
            <BreadcrumbItem key={index}>
              {crumb.href ? (
                <BreadcrumbLink onClick={() => onLink(crumb.href)}>
                  {crumb.name}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbLink
                  _hover={{ textDecoration: "none" }}
                  style={{ cursor: "default" }}
                >
                  {crumb.name}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          ))}
      </Breadcrumb>
    </>
  );
};
