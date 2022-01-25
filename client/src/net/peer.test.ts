import { Peer } from "./peer";

// describe(Peer, () => {


    test("peer should timeout gracefully", async () => {
        let [x,y] = await Promise.all([
            Peer.establish(),
            Peer.establish()
        ]);

        try {
            let peer = await x.connect_to(y.signaler.ident, 100);
            peer.close();
        } catch(e) {
            expect(e).toBe("timed out");
        }

        x.close();
        y.close();
    });

    test("peer should connect", async () => {
        let [x,y] = await Promise.all([
            Peer.establish(),
            Peer.establish()
        ]);

        let peer = await x.connect_to(y.signaler.ident);
        peer.close();
        x.close();
        y.close();

        return new Promise((resolve, _) => {
            y.addEventListener('peer', ({detail: peer}) => {
                peer.close();
                resolve(null);
            })
        });
    });

// }, );