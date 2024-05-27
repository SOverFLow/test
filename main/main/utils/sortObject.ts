import { ObjectStructure } from "@/app/[locale]/(pages)/department/[slug]/workers/utils/types";

export const sortObject = (obj: ObjectStructure): ObjectStructure => {
  // Convert object entries to an array
  const entries = Object.entries(obj);

  // Sort based on the count of `true` values
  entries.sort((a, b) => {
    const aTrueCount = Object.values(a[1]).filter(val => val).length;
    const bTrueCount = Object.values(b[1]).filter(val => val).length;

    return bTrueCount - aTrueCount;  // For descending order
  });

  // Convert the sorted array back to an object
  const sortedObj = entries.reduce<ObjectStructure>((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});

  return sortedObj;
};

function isObject(object:any) {
  return object != null && typeof object === 'object';
}
export function isDeepEqual(obj1:any, obj2:any) {
  if (!isObject(obj1) || !isObject(obj2)) {
    return obj1 === obj2;
  }
  console.log("here");
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    const val1 = obj1[key];
    const val2 = obj2[key];
    const areObjects = isObject(val1) && isObject(val2);

    if (
      (areObjects && !isDeepEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }

  return true;
}