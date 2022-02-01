export const getImage = async (ev: DragEvent): Promise<string> => {
  let dataItems = ev.dataTransfer?.items ?? [];
  return new Promise(async (resolve, reject) => {
    console.log("DataItems", dataItems.length);
    for (let i = 0; i < dataItems.length; i++) {
      console.log(dataItems[i].type);
      if (dataItems[i].type.startsWith("image/")) {
        const dataURL = await getDataURL(dataItems[i].getAsFile()!);
        return resolve(dataURL);
      }
      if (dataItems[i].type === "text/html") {
        dataItems[i].getAsString((s) => resolve(extractURLFromHTML(s)!));
        return;
      }
      if (dataItems[i].type === "application/x-moz-file-promise-url") {
        dataItems[i].getAsString(resolve);
        return;
      } else if (dataItems[i].kind === "string") {
        let t = dataItems[i].type;
        dataItems[i].getAsString((s) => console.log(t, s));
      }
    }
    return reject("No compatible drop type found");
  });
};

async function getDataURL(file: File): Promise<string> {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

function extractURLFromHTML(html: string): string | null {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.querySelector("img")?.src || null;
}
