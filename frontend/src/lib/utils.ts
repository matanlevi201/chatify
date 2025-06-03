import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function convertToFile(
  input: string,
  filename = "file"
): Promise<File> {
  try {
    const response = await fetch(input);
    if (!response.ok) throw new Error("Fetch failed");
    const blob = await response.blob();
    const contentType = blob.type || "application/octet-stream";
    return new File([blob], filename, { type: contentType });
  } catch (urlError) {
    console.warn("Failed to convert as URL:", urlError);
  }

  try {
    const blob = new Blob([input], { type: "image/svg+xml" });
    return new File(
      [blob],
      filename.endsWith(".svg") ? filename : `${filename}.svg`,
      { type: "image/svg+xml" }
    );
  } catch (svgError) {
    console.warn("Failed to convert as SVG:", svgError);
  }

  throw new Error("Failed to convert input to File using any known type.");
}
