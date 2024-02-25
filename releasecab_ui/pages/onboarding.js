import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Layout } from "@components/Layout";
import { AppShell } from "@components/app-shell/AppShell";
import { WithAuthGuard } from "@utils/auth/AuthGuard";
import { Header } from "@components/Header";
import { Progress } from "@components/progress-stepper/Progress";
import { OnboardingSteps } from "@constants/OnboardingSteps";
import { OnboardingRoleForm } from "@components/onboarding/OnboardingRoleForm";
import { OnboardingInviteUsersForm } from "@components/onboarding/OnboardingInviteUsersForm";
import { GetUserProfile } from "@services/UserApi";
import { OnboardingReleaseEnvs } from "@components/onboarding/OnboardingReleaseEnvs";
import { OnboardingReleaseTypes } from "@components/onboarding/OnboardingReleaseTypes";
import { OnboardingGetReleasing } from "@components/onboarding/OnboardingGetReleasing";
import { OnboardingTeamForm } from "@components/onboarding/OnboardingTeamForm";

const OnboardingPage = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const pageTitle = "Onboarding";
  let { currentStep, progressJsx, goToNextStep, goToPrevStep } = Progress({
    stepObj: OnboardingSteps,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      const userProfileResponse = await GetUserProfile();
      if (userProfileResponse.ok) {
        const userProfile = await userProfileResponse.json();
        setUser(userProfile);
        if (userProfile.is_onboarding_complete) {
          router.replace("/");
        }
        for (let i = 0; i < userProfile.last_onboarding_step; i++) {
          goToNextStep();
        }
        currentStep = userProfile.last_onboarding_step;
      }
      setLoading(false);
    };
    fetchUserProfile();
  }, []);

  const getForm = () => {
    switch (currentStep) {
      case 0:
        return (
          <OnboardingRoleForm
            goToNextStep={goToNextStep}
            currentStep={currentStep}
          />
        );
      case 1:
        return (
          <OnboardingTeamForm
            goToNextStep={goToNextStep}
            goToPrevStep={goToPrevStep}
            currentStep={currentStep}
          />
        );
      case 2:
        return (
          <OnboardingInviteUsersForm
            goToNextStep={goToNextStep}
            goToPrevStep={goToPrevStep}
            currentStep={currentStep}
          />
        );
      case 3:
        return (
          <OnboardingReleaseTypes
            goToNextStep={goToNextStep}
            goToPrevStep={goToPrevStep}
            currentStep={currentStep}
          />
        );
      case 4:
        return (
          <OnboardingReleaseEnvs
            goToNextStep={goToNextStep}
            goToPrevStep={goToPrevStep}
            currentStep={currentStep}
          />
        );
      case 5:
        return (
          <OnboardingGetReleasing
            goToPrevStep={goToPrevStep}
            currentStep={currentStep}
          />
        );
      default:
        return <></>;
    }
  };

  const renderContent = () => {
    if (loading) {
      return;
    } else {
      return (
        <>
          <Header
            title="Get Started"
            secondaryTitle="Let's get all the information we need so your team can hit the ground running 🚀"
            showSearchBox="true"
          />
          {progressJsx}
          {getForm()}
        </>
      );
    }
  };

  return (
    <Layout title={pageTitle} showfooter="false">
      <AppShell pageContent={renderContent()} />
    </Layout>
  );
};

export default WithAuthGuard(OnboardingPage);
