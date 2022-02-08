import { FileResponse, uuidv4 } from "../game/game-events";
import { proto_pair } from "../net/rtc-message-protocol";

type FileRequest = {
  type: "file-request";
  name: string;
};

type FileEvent = FileResponse | FileRequest;

export class ResourceManager {
  // Don't restore the index between sessions.
  index: string[] = [];

  get(res: string): string | null {
    if (res.startsWith("local:")) {
      return window.sessionStorage.getItem(res);
    } else {
      return res;
    }
  }

  register(file: Blob, id?: string): string {
    let name = id ?? "local:" + uuidv4();
    this.index.push(name);
    window.sessionStorage.setItem(name, URL.createObjectURL(file));
    return name;
  }

  all = (): [string, string][] => this.index.map((i) => [i, this.get(i)!]);
}
