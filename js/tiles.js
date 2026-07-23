class Tile {

    constructor(name, type, value, image) {

        this.name = name;

        this.type = type;

        this.value = value;

        this.image = image;

    }


    isNumberTile() {

        return this.type === "number";

    }


    isSpecialTile() {

        return (
            this.type === "wind" ||
            this.type === "dragon"
        );

    }


    increaseValue() {

        if (this.isSpecialTile()) {

            this.value++;

        }

    }


    decreaseValue() {

        if (this.isSpecialTile()) {

            this.value--;

        }

    }


}
