import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * next/navigation's redirect() throws a special digest-tagged error that
 * Next's client runtime must see propagate uncaught in order to perform the
 * navigation. Any try/catch around a Server Action that may call redirect()
 * must re-throw when this returns true, or the redirect silently never
 * happens and the catch block's error handling fires instead.
 */
export function isNextRedirectError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  )
}
