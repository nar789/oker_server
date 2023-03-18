

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
        console.log("cards : " + JSON.stringify(this.cards));

        //if rsf  allSameShape && 10JQKA(isMountine)
         // extra 로티플 무늬 첫번째 아이템 무늬

        //sf    (isBackSt() || isSt()) && allSameShape()
          //extra 탑 우선 > 무늬 :  가장 큰 수 오른쪽 > 제일 앞 아이템 무늬

        //fc    isFourCard()
          //extra 숫자 높은거  제일 앞 아이템 숫자

        //fh  isFullHouse()
          // extra  3장짜리가 높은 숫자가 이김

        //fl   isAllSameShape()
          // 탑 > 무늬   : 오름차순 숫자별 비교 > 제일 앞 아이템 무늬

        //mt   isMountine()
          // extra  A카드의 무늬

        //bst  isBst()
          // extra A카드의 무늬

        //st   isSt()
          // 탑 카드 숫자 비교 > 무늬

        //tr   isTr()
          // 포카드처럼 같은 숫자가 높은 사람이 이김
          

        //2f   getFairCount() >= 2
          // 높은 쪽 페어가 높은 쪽 > 나머지 페이가 높은 쪽 > 5번째 카드가 높은쪽 > 높은 페어의 무늬

        //1f   getFairCount() >= 1
          // 높은 페어가 이김 > 3 4 5 번째 카드의 탑으로 결정 > 페어의 무늬 

        //top - madeLevel = 12
          // 5장 까지 탑 순위로 결정 > 높은 카드의 무늬


          // TODO: resultList를 어떻게 결정할지 정하고 >> betting 정해야함

        //this.result = { madeLevel="", madeExtra="", resultList, }
        //madeExtra는 같은 메이드끼리 비교를 위한 추가 정보 정의가 필요함
        //result List는 isShow로 다섯장추린 거 보스 체크 시에는 필요없고, 카드 개수 파악해서 7장일때만 처리하면됨
    }


    compare(target)  {
        // this.result VS target.result  if win ? true : false
    }
}