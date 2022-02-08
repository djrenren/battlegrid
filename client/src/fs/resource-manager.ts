import { FileResponse, uuidv4 } from "../game/game-events";
import { proto_pair } from "../net/rtc-message-protocol";

type FileRequest = {
  type: "file-request";
  name: string;
};

type FileEvent = FileResponse | FileRequest;

export class ResourceManager {
  local: Map<string, string> = new Map();

  get(res: string) {
    if (res.startsWith("local:")) {
      return this.local.get(res);
    } else {
      return res;
    }
  }

  register(file: Blob, id?: string): string {
    let name = id ?? "local:" + uuidv4();
    this.local.set(name, URL.createObjectURL(file));
    return name;
  }
}
