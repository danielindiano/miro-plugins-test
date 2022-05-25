

type StickyIDWithPosition = {
	id: string;
	row: number;
	col: number;
}

let tiles: StickyIDWithPosition[][] = [];

const size = 100;

export async function draw(initialX = 0, initialY = 0) {
	const existTiles = await miro.board.getAppData<StickyIDWithPosition[][]>("tiles");
	if (existTiles) {
		// return;
	}
	for (let i = 0; i <= 7; i++) {
		let rowTiles: StickyIDWithPosition[] = [];
		tiles.push(rowTiles);
		for (let j = 0; j <= 7; j++){
			console.log(`Trying to create stickyNote (${i}, ${j})`)
			let tileSticky = await miro.board.createStickyNote({
				content: `(${i}, ${j})`,
				width: size,
				y: initialY + i * (size + 10),
				x: initialX + j * (size + 10),
			});
			rowTiles.push({id: tileSticky.id, row: i, col: j});
			
		}
	}

	await miro.board.setAppData("tiles", tiles);
}

async function changeTileColorById(id: string, color: "light_yellow" | "black") {
	const sticky = await miro.board.getById(id) as any;
	sticky.style.fillColor = color;
	await miro.board.sync(sticky);
}

export async function highlight(tile: StickyIDWithPosition) {
	// TODO: clear previous highlights (if any) and
	// then find the tiles in the two diagonals
	// (major and minor) that `tileEl` belongs to,
	// to highlight them via CSS class "highlighted"
	const existTiles = await miro.board.getAppData<StickyIDWithPosition[][]>("tiles");
	for (let row of existTiles) {
		for (let tile of row){
			changeTileColorById(tile.id, "light_yellow");
		}
	}
	
	let tileRowIdx = tile.row;
	let tileColIdx = tile.col;

	//transversing the major diagonal, upward and leftward
	for (let i = tileRowIdx, j= tileColIdx; i >= 0 && j >= 0; i--, j--) {
		let el = await findTile(i,j);
		if(el)
			changeTileColorById(el!.id, "black"); 
	}
	//transversing the major diagonal, downward and righward
	for (let i = tileRowIdx, j= tileColIdx; i <= 7 && j <= 7; i++, j++) {
		let el = await findTile(i,j);
		if(el)
			changeTileColorById(el!.id, "black"); 
	}

	//transversing the minor diagonal, upward and rightward
	for (let i = tileRowIdx, j= tileColIdx; i >= 0 && j <= 7; i--, j++) {
		let el = await findTile(i,j);
		if(el)
			changeTileColorById(el!.id, "black"); 
	}
	//transversing the minor diagonal, downward and leftward
	for (let i = tileRowIdx, j= tileColIdx; i <= 7 && j >= 0; i++, j--) {
		let el = await findTile(i,j);
		if(el)
			changeTileColorById(el!.id, "black"); 
	}
}

// Really not optimized
export async function findTileByStickyId(id: string): Promise<StickyIDWithPosition | null> {
	const existTiles = await miro.board.getAppData<StickyIDWithPosition[][]>("tiles");
	for (let row of existTiles) {
		for (let tile of row){
			if (tile.id === id) {
				return tile;
			}
		}
	}
	return null;
}

export async function findTile(row: number, col: number): Promise<StickyIDWithPosition | null> {
	const existTiles = await miro.board.getAppData<StickyIDWithPosition[][]>("tiles");
	if (existTiles) {
		return existTiles[row][col];
	}

	return null;
}