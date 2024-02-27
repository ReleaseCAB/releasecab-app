import {
  Button,
  Center,
  HStack,
  Icon,
  Square,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";

export const Dropzone = (props) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    const fileExtension = file.name.split(".").pop();
    if (fileExtension !== props.acceptedfiletypes.replace(".", "")) {
      props.seterror(
        "Invalid file type. Please upload a file with the correct extension.",
      );
      return;
    }
    props.seterror(null);
    props.setfile(file);
  };

  const handleFileInput = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const fileExtension = file.name.split(".").pop();
    if (fileExtension !== props.acceptedfiletypes.replace(".", "")) {
      props.seterror(
        "Invalid file type. Please upload a file with the correct extension.",
      );
      return;
    }
    props.seterror(null);
    props.setfile(file);
  };

  return (
    <Center
      borderWidth="1px"
      borderRadius="lg"
      px="6"
      py="4"
      bg={useColorModeValue("white", "gray.800")}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <VStack spacing="3">
        <Square size="10" bg="bg.subtle" borderRadius="lg">
          <Icon as={FiUploadCloud} boxSize="5" color="fg.muted" />
        </Square>
        <VStack spacing="1">
          <HStack spacing="1" whiteSpace="nowrap">
            <Button
              variant="text"
              color="brand.link_blue"
              size="sm"
              pr={0}
              as="label"
              htmlFor="file-input"
              cursor="pointer"
            >
              Click to upload
            </Button>
            <Text textStyle="sm" color="brand.gray_text">
              or drag and drop
            </Text>
          </HStack>
          <Text textStyle="xs" color="brand.gray_text">
            {props.acceptedfiletypes} files accepted
          </Text>
          <input
            id="file-input"
            type="file"
            accept={props.acceptedfiletypes}
            onChange={handleFileInput}
            style={{ display: "none" }}
          />
        </VStack>
      </VStack>
    </Center>
  );
};
