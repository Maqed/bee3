import { absoluteURL } from "@/lib/utils";

export async function getUserById(id: string) {
  const response = await fetch(absoluteURL(`/api/user?id=${id}`), {
    method: "GET",
  });
  return await response.json();
}
