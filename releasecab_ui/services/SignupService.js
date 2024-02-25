import { capitalizeFirstWord } from "@utils/Helpers";
import { CreateUser } from "./UserApi";

export async function CreateNewUser(
  email,
  password,
  firstName,
  lastName,
  isOwner,
  onboardingNotNeeded,
  tenantId,
) {
  const response = await CreateUser(
    email,
    password,
    firstName,
    lastName,
    isOwner,
    onboardingNotNeeded,
    tenantId,
  );
  if (response.ok) {
    const responseData = await response.json();
    return responseData;
  } else {
    const errorData = await response.json();
    if (typeof errorData === "object") {
      const errorMessages = [];
      for (const key in errorData) {
        if (Array.isArray(errorData[key])) {
          const formattedAlertMessages = errorData[key].map(
            (errorMessage) =>
              `- ${capitalizeFirstWord(errorMessage.replace(/[\[\]']+/g, ""))}`,
          );
          errorMessages.push(...formattedAlertMessages);
        } else {
          errorMessages.push(`- ${capitalizeFirstWord(errorData[key])}`);
        }
      }
      const joinedAlertMessages = errorMessages
        .join("<br>")
        .replace(/.,/g, ".<br>-");
      throw new Error(`<br>${joinedAlertMessages}`);
    } else if (typeof errorData === "string") {
      throw new Error(errorData);
    } else {
      throw new Error("An unknown error occurred. Please contact support.");
    }
  }
}
