import { DurableSignaler } from "./signaling";
/**
 * @jest-environment jsdom
 */

describe(DurableSignaler, () => {
    it('can relay a message', async () => {
        let [x, y] = await Promise.all([
            DurableSignaler.establish(new URL("ws://localhost:8080/")),
            DurableSignaler.establish(new URL("ws://localhost:8080/")),
        ]);

        const msg = "Hello"
        x.send(y.ident, {msg});
        await new Promise((resolve, reject) => {
            y.addEventListener('message', ev => {
                try {
                    expect(ev.detail.msg).toBe(msg);
                } catch(e) {
                    return reject(e);
                }
                resolve(null);
            });
        });
    });

    it('notifies when disconnected', async () => {
        let x = await DurableSignaler.establish(new URL("ws://localhost:8080"));
        
        return new Promise((resolve, reject) => {

            x.addEventListener('status', (ev) => {
                try {
                    expect(ev.detail).toBe('disconnected');
                } catch(e) {
                    reject(e);
                }
                resolve(null);
            })

            x._disconnect();
        })
    });

    it('reconnects after loss', async () => {
        let x = await DurableSignaler.establish(new URL("ws://localhost:8080/"));

        return new Promise((resolve, reject) => {
            x.addEventListener('status', ({detail: status}) => {
                if (status === 'connected')  {
                    resolve(null);
                }
            });

            x._disconnect();
        })
    });

    it('notifies on close', async () => {
        let x = await DurableSignaler.establish(new URL("ws://localhost:8080/"));


        return new Promise((resolve, reject) => {
            x.addEventListener('status', ({detail: status}) => {
                if (status === 'closed')  {
                    resolve(null);
                }
            });

            x.close();
        })
    })

    it('supports suggested ids', async () => {
        let ident = "h4x0rz";
        let x = await DurableSignaler.establish(new URL("ws://localhost:8080"), ident);

        expect(x.ident).toBe(ident);
    });

    it('does not allow duplicate ids', async () => {
        let ident = "duping";
        let x = await DurableSignaler.establish(new URL("ws://localhost:8080"), ident);

        expect(async () => {
            await DurableSignaler.establish(new URL("ws://localhost:8080"), ident);
        }).rejects.toThrow();
    });

});