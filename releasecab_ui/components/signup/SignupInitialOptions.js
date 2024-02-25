import {
  Box,
  Button,
  Flex,
  Heading,
  Radio,
  RadioGroup,
  Text,
} from "@chakra-ui/react";
import { GetTenantConfig } from "@services/TenantApi";
import { useEffect, useState } from "react";

export const SignupInitialOptions = (props) => {
  const [localSelectedOption, setLocalSelectedOption] = useState("");
  const [tenantConfig, setTenantConfig] = useState();

  const fetchTenantConfig = async () => {
    const response = await GetTenantConfig();
    if (response.ok) {
      const data = await response.json();
      setTenantConfig(data);
    }
  };

  useEffect(() => {
    fetchTenantConfig();
  }, []);

  const handleOptionChange = (value) => {
    setLocalSelectedOption(value);
  };

  const handleSubmit = () => {
    props.setSelectedOption(localSelectedOption);
  };

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      background="gray.100"
      paddingX="4"
    >
      <Box width="700px" p="6" bg="white" rounded="lg" boxShadow="lg">
        <Flex direction="column" mb="6">
          <Heading as="h1" size="2xl" mb="2" textAlign="center">
            Signup for Release CAB
          </Heading>
          <Text size="md" color="gray.600" textAlign="center">
            Please select one of the options below:
          </Text>
        </Flex>
        <RadioGroup value={localSelectedOption}>
          <Flex direction="column" mb="4">
            <Radio
              pb={"2"}
              value="registered"
              onChange={() => handleOptionChange("registered")}
            >
              <Text ml="2">
                My company is signed up and I have an access code
              </Text>
            </Radio>
            <Radio
              value="register"
              onChange={() => handleOptionChange("register")}
              isDisabled={!tenantConfig?.allowed_to_create_tenant}
            >
              <Text ml="2">I want to sign my company up</Text>
            </Radio>
          </Flex>
        </RadioGroup>
        <Flex justify="flex-end">
          <Button
            bg="brand.button_enabled"
            color="brand.white_text"
            size="lg"
            onClick={handleSubmit}
            isDisabled={!localSelectedOption}
          >
            Continue
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};
