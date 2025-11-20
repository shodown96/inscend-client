import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatString = (...args: any) => {
  let i = 1;
  const str = args[0];
  return str.replace(/{}/g, function () {
    return typeof args[i] != 'undefined' ? args[i++] : '';
  });
}

export const formatSeconds = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const mins = minutes > 9 ? minutes : `0${minutes}`
  const formattedTime = `${mins}:${String(seconds).padStart(2, "0")}`;
  return formattedTime;
};

export const getLimitedText = (text: string | null, limit = 50) => {
  if (!text) {
    return ""
  }
  if (text.length > 0) {
    if (text.length > limit) {
      return `${text.split("").slice(0, limit).join("")}...`;
    }
    return text
  }
};

export function getOS(): 'mac' | 'windows' {
  const userAgent = window.navigator.userAgent;
  let os = "";
  console.log(userAgent)
  if (userAgent.indexOf("Mac") !== -1 || userAgent.indexOf("Mac OS X") !== -1) {
    os = "Mac";
  } else if (userAgent.indexOf("Windows") !== -1) {
    os = "Windows";
  }

  return os.toLowerCase() as 'mac' | 'windows';
}

export const getInitials = (name = "") => {
  return name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export const delayDebounceFn = (callBack: () => void) =>
  setTimeout(callBack, 300);

export const determineBusinessCategory = (type: string) =>
  type === "Service" ? "U1" : "U2";
