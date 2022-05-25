import { StickyNote } from "@mirohq/websdk-types";
import * as chessboard from "./chessboard";

async function init() {
  miro.board.ui.on('icon:click', async () => {
    await chessboard.draw(0, 0);
  });

  miro.board.ui.on("selection:update", async (ev) => {
    const selection = ev.items;
    if (selection.length !== 1 || selection[0].type !== "sticky_note") {
      return;
    }
    const sticky = selection[0] as StickyNote; 
    const tile = await chessboard.findTileByStickyId(sticky.id);
    if (tile) {
      await chessboard.highlight(tile);
    }
  });
}

init();

