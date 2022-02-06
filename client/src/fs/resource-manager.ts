import { uuidv4 } from "../game/game-events";

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
    let res_id = id ?? "local:" + uuidv4();
    this.local.set(res_id, URL.createObjectURL(file));
    return res_id;
  }
}
