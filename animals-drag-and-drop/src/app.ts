
async function selectAnimalImageFromText(textContent: string): Promise<{image: string, fact: string} | null> {
    let url = null;
    switch(textContent){
        case "cat":
        case "dog":
        case "fox":
        case "panda":
        case "koala":
        case "bird":
        case "racoon":
        case "kangaroo":
            url = `https://some-random-api.ml/animal/${textContent}`;
            break;
        }
        if (url === null) {
            console.log({textContent});
            return null;
        }

        const responseBody = await (await (await fetch(url)).json());
        const {image, fact} = responseBody;

        return {image, fact};

    
    
}

async function configDropEvent() {
    miro.board.ui.on("drop", async (dropEvent) => {
        console.log("Drop triggered")
        const selection = await selectAnimalImageFromText(dropEvent.target.textContent!.toLowerCase());
        if (selection !== null) {
            await miro.board.createImage({
                x: dropEvent.x,
                y: dropEvent.y,
                url: selection.image,
                title: selection.fact,
                width: 200,
            });
        }
    })
}


configDropEvent();