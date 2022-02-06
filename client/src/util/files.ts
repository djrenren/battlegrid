type DroppedImage = { blob: Blob } | { url: string };

export const getImage = async (ev: DragEvent): Promise<DroppedImage> => {
  let dataItems = ev.dataTransfer?.items ?? [];
  return new Promise(async (resolve, reject) => {
    console.log("DataItems", dataItems.length);
    for (let i = 0; i < dataItems.length; i++) {
      console.log(dataItems[i].type);
      if (dataItems[i].type.startsWith("image/")) {
        return resolve({ blob: dataItems[i].getAsFile()! });
      }
      if (dataItems[i].type === "text/html") {
        dataItems[i].getAsString((s) => resolve(extractURLFromHTML(s)!));
        return;
      }
      if (dataItems[i].type === "application/x-moz-file-promise-url") {
        dataItems[i].getAsString((s) => {
          url: resolve;
        });
        return;
      } else if (dataItems[i].kind === "string") {
        let t = dataItems[i].type;
        dataItems[i].getAsString((s) => console.log(t, s));
      }
    }
    return reject("No compatible drop type found");
  });
};

function extractURLFromHTML(html: string): DroppedImage | null {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const url = doc.querySelector("img")?.src;
  return url ? { url } : null;
}
