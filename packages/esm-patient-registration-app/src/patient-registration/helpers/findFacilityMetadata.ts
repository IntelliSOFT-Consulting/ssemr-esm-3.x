import { facilities } from "../field/uniqueId/assets/identifier-assets";

interface Facility {
  name: string;
}

export const findFacilityMetadata = (facilityName: string) => {
  for (const [state, facilitiesList] of Object.entries(facilities[0])) {
    const foundFacility = facilitiesList.find(
      (facility: Facility) => facility.name === facilityName
    );
    if (foundFacility) {
      return { state, facility: foundFacility };
    }
  }
  return null;
};

export const getStateAndFacilityByCode = (code) => {
  for (const stateGroup of facilities) {
    for (const [stateName, facilityList] of Object.entries(stateGroup)) {
      for (const facility of facilityList) {
        if (facility.code === code) {
          return { state: stateName, facility: facility.name };
        }
      }
    }
  }
  return null;
};
// This is a helper to calculate the next unique ART number based on existing numbers
export const getNextARTNumber = (
  artNumbers: string[],
  facilities: string
): string => {
  const suffix = artNumbers
    .map((id) => parseInt(id.split("/").at(-1)))
    .filter((num) => !isNaN(num));

  const maxSuffix = suffix.length > 0 ? Math.max(...suffix) : 0;

  const nextSuffix = String(maxSuffix + 1).padStart(5, "0");

  return `${facilities}/${nextSuffix}`;
};
