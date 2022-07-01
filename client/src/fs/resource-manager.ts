import { uuidv4 } from "../game/game-events";
import { LocalOrRemoteImage } from "../util/files";
import {ResourceEvent as FileResponse} from '../net/rtc/rtc-resource-encoder';

type FileRequest = {
  type: "file-request";
  name: string;
};

type FileEvent = FileResponse | FileRequest;
export type Resource = string & { __brand: "resource" };
export type URLString = string & { __brand: "url" };
export class ResourceManager {
  // Don't restore the index between sessions.
  index: Set<Resource> = new Set();

  get(res: Resource): string | null {
    if (res.startsWith("local:")) {
      return window.sessionStorage.getItem(res);
    } else {
      return res;
    }
  }

  delete(res: Resource): boolean {
    const url = this.get(res);
    if (!url) return false;
    URL.revokeObjectURL(url);
    window.sessionStorage.removeItem(res);
    return true;
  }

  register(file: LocalOrRemoteImage, id?: string): Resource {
    // URLs are valid resources
    if (typeof file === "string") {
      return file as Resource;
    }
    let name = (id ?? "local:" + uuidv4()) as Resource;
    this.index.add(name);
    window.sessionStorage.setItem(name, URL.createObjectURL(file));
    return name;
  }

  *all(): IterableIterator<[Resource, string]> {
    for (let res of this.index.values()) {
      yield [res, this.get(res)!];
    }
  }
}
