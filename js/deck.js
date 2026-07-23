class Deck {

    constructor() {

        this.drawPile = [];

        this.discardPile = [];

        this.reshuffleCount = 0;

        this.initializeDeck();

    }


    // =========================================
    // CREATE A FRESH 136-TILE DECK
    // =========================================

    createFreshDeck() {

        const deck = [];


        // =====================================
        // NUMBER TILES
        // =====================================

        const suits = [

            {
                type: "characters",
                prefix: "Man",
                displayName: "Characters"
            },

            {
                type: "bamboos",
                prefix: "Sou",
                displayName: "Bamboos"
            },

            {
                type: "dots",
                prefix: "Pin",
                displayName: "Dots"
            }

        ];


        suits.forEach(
            suit => {

                for (
                    let number = 1;
                    number <= 9;
                    number++
                ) {

                    for (
                        let copy = 0;
                        copy < 4;
                        copy++
                    ) {

                        deck.push(

                            new Tile(

                                `${number} ${suit.displayName}`,

                                "number",

                                number,

                                `assets/tiles/${suit.type}/${suit.prefix}${number}.png`

                            )

                        );

                    }

                }

            }
        );


        // =====================================
        // WINDS
        // =====================================

        const winds = [

            {
                name: "East Wind",
                image: "Ton.png"
            },

            {
                name: "South Wind",
                image: "Nan.png"
            },

            {
                name: "West Wind",
                image: "Shaa.png"
            },

            {
                name: "North Wind",
                image: "Pei.png"
            }

        ];


        winds.forEach(
            wind => {

                for (
                    let copy = 0;
                    copy < 4;
                    copy++
                ) {

                    deck.push(

                        new Tile(

                            wind.name,

                            "wind",

                            5,

                            `assets/tiles/winds/${wind.image}`

                        )

                    );

                }

            }
        );


        // =====================================
        // DRAGONS
        // =====================================

        const dragons = [

            {
                name: "Red Dragon",
                image: "Chun.png"
            },

            {
                name: "Green Dragon",
                image: "Hatsu.png"
            },

            {
                name: "White Dragon",
                image: "Haku.png"
            }

        ];


        dragons.forEach(
            dragon => {

                for (
                    let copy = 0;
                    copy < 4;
                    copy++
                ) {

                    deck.push(

                        new Tile(

                            dragon.name,

                            "dragon",

                            5,

                            `assets/tiles/dragons/${dragon.image}`

                        )

                    );

                }

            }
        );


        return deck;

    }


    // =========================================
    // INITIALIZE
    // =========================================

    initializeDeck() {

        this.drawPile =
            this.createFreshDeck();

        this.discardPile = [];

        this.shuffle();

    }


    // =========================================
    // SHUFFLE
    // =========================================

    shuffle() {

        for (
            let i = this.drawPile.length - 1;
            i > 0;
            i--
        ) {

            const randomIndex =
                Math.floor(
                    Math.random() *
                    (i + 1)
                );


            [
                this.drawPile[i],
                this.drawPile[randomIndex]
            ] = [

                this.drawPile[randomIndex],
                this.drawPile[i]

            ];

        }

    }


    // =========================================
    // DRAW TILE
    // =========================================

    draw() {

        if (
            this.drawPile.length === 0
        ) {

            this.reshuffle();

        }


        if (
            this.drawPile.length === 0
        ) {

            return null;

        }


        return this.drawPile.pop();

    }


    // =========================================
    // DISCARD TILE
    // =========================================

    discard(tile) {

        if (!tile) {

            return;

        }


        this.discardPile.push(tile);

    }


    // =========================================
    // REQUIRED RESHUFFLE LOGIC
    //
    // When Draw Pile is empty:
    //
    // 1. Create fresh deck
    // 2. Add discard pile
    // 3. Shuffle everything
    // 4. Increase reshuffle count
    // =========================================

    reshuffle() {

        this.reshuffleCount++;


        const freshDeck =
            this.createFreshDeck();


        this.drawPile = [

            ...freshDeck,

            ...this.discardPile

        ];


        this.discardPile = [];


        this.shuffle();

    }


    getDrawCount() {

        return this.drawPile.length;

    }


    getDiscardCount() {

        return this.discardPile.length;

    }


    getReshuffleCount() {

        return this.reshuffleCount;

    }

}
