export async function handleRequestError(response: Response) {
  const data = await response.json();
  const errorMessage = data?.detail ??
    Object.values(data as Record<string, string>).join(", ");
  throw new Error(errorMessage);
}
