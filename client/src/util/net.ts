import { EventEmitter, waitFor } from "./events";

export type Status = 'open' | 'closed' | 'opening';

export type HasStatus = {status: Status}  & EventEmitter<{
    status: CustomEvent<Status>
}>;

export function connected(i: HasStatus): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        let handler = ({detail: status}: {detail: Status}) => {
            status === 'open' && resolve();
            status === 'closed' && reject();
            i.removeEventListener('status', handler);
        }
        i.addEventListener('status', handler);
        handler({detail: i.status});
    });
}


export class StatusEmitter extends EventTarget implements EventEmitter<{
    'status': CustomEvent<Status>
}>
{
    #value: Status = 'opening';
    get current() {
        return this.#value;
    }

    set(s: Status) {
        this.#value = s;
        setTimeout(() => this.onstatus && this.onstatus(s), 0);
        this.dispatchEvent(new CustomEvent('status', {detail: s}));
    }

    async connected(): Promise<void> {
        if (this.#value === 'closed') throw "closed";
        if (this.#value === 'open') return;
        if (this.#value === 'opening') {
            return new Promise((resolve, reject) => {
                let handler: EventListener = (e: Event) => {
                    let s = (e as CustomEvent).detail;
                    if (s === 'opening') return;

                    if (s === 'closed') {
                        reject('closed');
                    } else if (s === 'open') {
                        resolve();
                    }

                    this.removeEventListener('status', handler);
                }
                this.addEventListener('status', handler);
            });
        }
    }

    onstatus?: (s: Status) => void;
}