export const timeout = <T>(prom: Promise<T>, time: number): Promise<T> =>
  Promise.race([prom, new Promise((_r, rej) => setTimeout(rej, time)) as Promise<T>]);

export async function retry<T>(times: number, prom: () => Promise<T>): Promise<T> {
  while (true) {
    try {
      return await prom();
    } catch (e) {
      if (times-- == 0) {
        throw e;
      }
    }
  }
}
