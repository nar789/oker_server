

module.exports = class Result {



    constructor(cards) {
        this.cards = JSON.parse(JSON.stringify(cards));
        this.result = {};
    }


    

    shapeToInt(a) {
        if(a == "S") {
            return 4;
        }
        else if(a=="D") {
            return 3;
        } else if(a=="H") {
            return 2;
        } else if(a=="C") {
            return 1;
        }
    }

    compareShape(a, b) {
        if(this.shapeToInt(a) > this.shapeToInt(b)) return 1;
        if(this.shapeToInt(a) == this.shapeToInt(b)) return 0;
        if(this.shapeToInt(a) < this.shapeToInt(b)) return -1;
    }

    sortCards() {
        this.cards.sort((a,b)=> {
            let n1 = a.number == 1 ? 14 : a.number;
            let n2 = b.number == 1 ? 14 : b.number;
            if(n1 > n2) return 1;
            if(n1 == n2) {
                return this.compareShape(a.shape, b.shape);
            }
            if(n1 < n2) return -1;
        });
    }

    isAllSameShape() {
        let s = this.cards[0].shape;
        for(var c of this.cards) {
            if(s != c.shape) {
                return false;
            }
        }
        return true;
    }

    isMountine() {

    }

    isBackSt() {

    }

    isSt() {

    }

    isFourCard() {

    }

    isFullHouse() {

    }

    isTr() {

    }

    getFairCount() {

    }


    calc() {
        this.sortCards();

        //if rsf  allSameShape && 10JQKA(isMountine)

        //sf    (isBackSt() || isSt()) && allSameShape()

        //fc    isFourCard()

        //fh  isFullHouse()

        //fl   isAllSameShape()

        //mt   isMountine()

        //bst  isBst()

        //st   isSt()

        //tr   isTr()

        //2f   getFairCount() >= 2

        //1f   getFairCount() >= 1

        //top  



        //this.result = { madeLevel="", madeExtra="", resultList, }
    }


    compare(target)  {
        // this.result VS target.result  if win ? true : false
    }
}