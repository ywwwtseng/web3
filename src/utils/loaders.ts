export async function loadImage(url: string): Promise<Blob | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return null;
    }

    const blob = await res.blob();

    return blob;
  } catch (error) {
    return null;
  }
}
