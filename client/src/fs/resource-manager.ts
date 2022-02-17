import { FileResponse, uuidv4 } from "../game/game-events";
import { proto_pair } from "../net/rtc-message-protocol";
import { LocalOrRemoteImage } from "../util/files";

type FileRequest = {
  type: "file-request";
  name: string;
};

type FileEvent = FileResponse | FileRequest;
export type Resource = string & { __brand: "resource" };
export type URLString = string & { __brand: "url" };
export class ResourceManager {
  // Don't restore the index between sessions.
  index: Resource[] = [];

  get(res: Resource): string | null {
    if (res.startsWith("local:")) {
      return window.sessionStorage.getItem(res);
    } else {
      return res;
    }
  }

  register(file: LocalOrRemoteImage, id?: string): Resource {
    // URLs are valid resources
    if (typeof file === "string") {
      return file as Resource;
    }
    let name = (id ?? "local:" + uuidv4()) as Resource;
    this.index.push(name);
    window.sessionStorage.setItem(name, URL.createObjectURL(file));
    return name;
  }

  all = (): [Resource, string][] => this.index.map((i) => [i, this.get(i)!]);
}
