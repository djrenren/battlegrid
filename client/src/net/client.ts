import { type Protocol as P } from "./protocol";

export type Status = "disconnected" | "connecting" | "connected" | "error";

export interface Client {
    get status(): Status;
    readonly events: ReadableWritablePair,
    readonly data: ReadableWritablePair,
    close(): void;
}


interface Descriptor<I, O> {
    request: I,
    response?: O,
}

type RespType<Protocol, K extends keyof Protocol> = Protocol[K] extends Descriptor<any, infer O> ? O : never;
type ReqType<Protocol, K extends keyof Protocol> = Protocol[K] extends Descriptor<infer I, any> ? I : never;
type Event<T, Data> = {
    type: T;
} & Data;

type Request<Protocol, K extends keyof Protocol> = {
    header?: {
        request: string,
    }
    data: Event<K, ReqType<Protocol, K>>
};

type Response<Protocol, K extends keyof Protocol> = {
    header: {
        response_to: string,
    }
    data: Event<K, ReqType<Protocol, K>>
};

export type Message<Protocol=P> = Request<Protocol, keyof Protocol> | Response<Protocol, keyof Protocol>;

export class RichClient<Protocol=P> {
    #client: Client;
    #handlers: Map<string, (_: any) => any> = new Map();
    #open_requests: Map<string, {resolve: (_: any) => void, reject: (_: any) => void, timeout: ReturnType<typeof setTimeout>}> = new Map();
    #events_writer: WritableStreamDefaultWriter<Message<Protocol>>;
    #data_writer: WritableStreamDefaultWriter<Message<Protocol>>;

    get status() {
        return this.#client.status
    }

    constructor(client: Client) {
        this.#client = client;
        this.#events_writer = client.events.writable.getWriter();
        this.#data_writer = client.data.writable.getWriter();

        this.#start_read_loop(client.events.readable.getReader());
        this.#start_read_loop(client.data.readable.getReader());
    }


    send<K extends keyof Protocol>(event: Event<K, ReqType<Protocol, K>>, slow?: boolean) {
        let stream = slow ? this.#data_writer: this.#events_writer;
        stream.write({
            data: event
        })
    }

    async request<K extends keyof Protocol>(event: Event<K, ReqType<Protocol, K>>, slow?: boolean): Promise<RespType<Protocol, K>> {
        let stream = slow ? this.#data_writer: this.#events_writer;

        let uuid = crypto.randomUUID();
        stream.write({
            header: {request: uuid},
            data: event as any
        });

        return await new Promise((resolve, reject) => {
            let timeout = setTimeout(() => {
                this.#open_requests.delete(uuid);
                reject({error: 'request timeout'});
            }, 1000);

            this.#open_requests.set(uuid, {
                resolve(value) {
                    clearTimeout(timeout)
                    resolve(value);
                },
                reject,
                timeout,
            })
        });
    }

    handle<T extends keyof Protocol & string>(type: T, func: (d: ReqType<Protocol, T>) => RespType<Protocol, T>) {
        this.#handlers.set(type, func);
    }

    #start_read_loop(reader: ReadableStreamDefaultReader) {
        (async () => {
            let value, done;
            while (({value, done} = await reader.read()) && !done) {
                console.log("RICH CLIENTS SAW", value);
                this.#handle_incoming(value);
            }
        })()
    }

    #handle_incoming(event: Message<Protocol>) {
        let header = event.header;
        if (header && 'response_to' in header) {
            let item = this.#open_requests.get(header.response_to);
            if (!item) {
                console.error("Received response to unknown request: ", event);
                return;
            }

            return item.resolve(event.data);
        }

        if (header && header.request) {
            const handler = this.#handlers.get(header.request);
            handler && handler(event.data);
        }

        this.on_event(event.data);
    }

    close() {
        this.#client.close();
    }

    on_event<K extends keyof Protocol>(ev: Event<K, ReqType<Protocol, K>>) {};
}