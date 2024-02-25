import { Header } from "@components/Header";
import { Layout } from "@components/Layout";
import { Progress } from "@components/progress-stepper/Progress";
import { SignupCompanyForm } from "@components/signup/SignupCompanyForm";
import { SignupInitialOptions } from "@components/signup/SignupInitialOptions";
import { SignupRegisteredCompany } from "@components/signup/SignupRegisteredCompany";
import { SignupReview } from "@components/signup/SignupReview";
import { SignupUserForm } from "@components/signup/SignupUserForm";
import { SignupSteps } from "@constants/SignupSteps";
import { WithoutAuthGuard } from "@utils/auth/AuthGuard";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const SignUp = () => {
  const { query } = useRouter();
  const pageTitle = "Sign Up";
  const [selectedOption, setSelectedOption] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [numberOfEmployees, setNumberOfEmployees] = useState("");
  const [companyKey, setCompanyKey] = useState("");
  const [companyKeyProvided, setCompanyKeyProvided] = useState("false");
  const { currentStep, progressJsx, goToNextStep, goToPrevStep } = Progress({
    stepObj: SignupSteps,
  });

  useEffect(() => {
    if (query.code) {
      setSelectedOption("registered");
      setCompanyKeyProvided("true");
      setCompanyKey(query.code);
    }
  }, [query]);

  const getForm = () => {
    switch (currentStep) {
      case 0:
        return (
          <SignupUserForm
            goToNextStep={goToNextStep}
            email={email}
            setEmail={setEmail}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
          />
        );
      case 1:
        return (
          <SignupCompanyForm
            goToNextStep={goToNextStep}
            goToPrevStep={goToPrevStep}
            companyName={companyName}
            setCompanyName={setCompanyName}
            numberOfEmployees={numberOfEmployees}
            setNumberOfEmployees={setNumberOfEmployees}
          />
        );
      case 2:
        return (
          <SignupReview
            goToPrevStep={goToPrevStep}
            email={email}
            setEmail={setEmail}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            password={password}
            setPassword={setPassword}
            companyName={companyName}
            setCompanyName={setCompanyName}
            numberOfEmployees={numberOfEmployees}
            setNumberOfEmployees={setNumberOfEmployees}
          />
        );
      default:
        return <></>;
    }
  };

  return (
    <Layout title={pageTitle}>
      {selectedOption === null ? (
        <SignupInitialOptions
          setSelectedOption={setSelectedOption}
          selectedOption={selectedOption}
        />
      ) : selectedOption === "register" ? (
        <>
          <Header
            title="Sign Up"
            secondaryTitle="Let's get all your information to create an account!"
            showSearchBox="false"
          />
          {progressJsx}
          {getForm()}
        </>
      ) : (
        <>
          <Header
            title="Sign Up"
            secondaryTitle="Let's get all your information to create an account!"
            showSearchBox="false"
          />
          <SignupRegisteredCompany
            companyKey={companyKey}
            setCompanyKey={setCompanyKey}
            companyKeyProvided={companyKeyProvided}
            email={email}
            setEmail={setEmail}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
          />
        </>
      )}
    </Layout>
  );
};

export default WithoutAuthGuard(SignUp);
