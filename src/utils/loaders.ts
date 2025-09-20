export async function loadImage(url: string): Promise<Blob | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return null;
    }

    return await res.blob();
  } catch (error) {
    return null;
  }
}
