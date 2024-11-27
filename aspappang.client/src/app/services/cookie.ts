import { User } from "../models/user";

export function getCookie(key: string): string | null {
  const cookies = document.cookie.split(/[;=]/).map(x => x.trim());

  for (let i = 0; i < cookies.length; i += 2) {
    if (cookies[i] == key) {
      return cookies[++i];
    }
  }

  return null;
}

export function setCookie(key: string, val: string, exDays: number | string): null | string;
export function setCookie(key: string, val: string): void;

export function setCookie(key: string, val: string, exDays?: any | number | string): void | null | string {
  let interval = null,
      date = null;

  if (typeof exDays == "number") {
    interval = exDays * 24 * 60 * 60 * 1000;

    date = new Date();
    date.setTime(date.getTime() + (interval ?? 0));
  }

  let expires;

  if (typeof exDays != "string") {
    expires = interval ? `;expires=${date?.toUTCString()}` : "";
  }
  else {
    expires = `;expires=${exDays}`;
  }
  
  document.cookie = `${key}=${val};path=/` + expires;

  if (typeof exDays == "number") {
    return date?.toUTCString();
  }
}

export function removeCookie(key: string) {
  const date = new Date();
  date.setTime(date.getTime() - 1000);

  document.cookie = `${key}=;expires=${date.toUTCString()};path=/;domain=localhost`;
}
