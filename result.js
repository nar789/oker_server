

module.exports = class Result {



    constructor(cards) {
        this.cards = JSON.parse(JSON.stringify(cards)); //copy
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
        if(this.shapeToInt(a) > this.shapeToInt(b)) return -1;
        if(this.shapeToInt(a) == this.shapeToInt(b)) return 0;
        if(this.shapeToInt(a) < this.shapeToInt(b)) return 1;
    }

    sortCards() {
        this.cards.sort((a,b)=> {
            let n1 = a.number == 1 ? 14 : a.number;
            let n2 = b.number == 1 ? 14 : b.number;
            if(n1 > n2) return -1;
            if(n1 == n2) {
                return this.compareShape(a.shape, b.shape);
            }
            if(n1 < n2) return 1;
        });
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

    isRsf() {
        let mountine = [1, 10, 11, 12, 13];
        let mn = [0, 0, 0, 0, 0];
        let ms = [0, 0, 0, 0];
        
        for(var c of this.cards) {
            for(var mi=0;mi<mountine.length;mi++) {
                if(mountine[mi] == c.number) {
                    mn[mi]+=1;
                    if(c.shape == 'S') ms[3]+=1;
                    else if(c.shape == 'D') ms[2]+=1;
                    else if(c.shape == 'H') ms[1]+=1;
                    else if(c.shape == 'C') ms[0]+=1;
                }
            }
        }

        for(var mi=0;mi<mountine.length;mi++) {
            if(mn[mi] == 0) {
                return null;
            }
        }
        for(var i=0;i<4;i++) {
            if(ms[i] >= 5) {

                let shape = '';
                if(i == 3) {
                    shape = 'S';
                } else if(i == 2) {
                    shape = 'D';
                } else if(i == 1) {
                    shape = 'H';
                } else if(i == 0) {
                    shape = 'C';
                }

                for(var c of this.cards) {
                    c.isShow = false;
                    for(var j=0;j<mountine.length;j++) {
                        if(c.number == mountine[j] && c.shape == shape) {
                            c.isShow = true;
                        }
                    }
                }

                this.result = {
                    madeLevel : 1,
                    madeExtra : i + 1, //S = 4, D = 3, H= 2, C = 1
                }
                return this.result;
            }
        }
        return null;
    }

    isSf() {
        
    }


    calc() {
        this.sortCards();

        const isRsf = this.isRsf();
        
        if(isRsf != null) {
            return isRsf;
        }



        
            
            //is moutine
              //is same shae -> rsf
              //else mountine

            //is st
              //is bst -> level / extra/ 
              //is same shape -> sf
              //else bst
              //else st
            
            // is all same shape -> fl

            // fc

         

            
        
            //fc
            //t
            //2f
            //1f
            //top
        



        //if rsf  allSameShape && 10JQKA(isMountine)
         // extra 로티플 무늬 첫번째 아이템 무늬
         // showList는 isMountine참고
        

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
          // game.js <-> index.html  서버와 클라의 데이터 흐름 정의하면 좋을듯 시퀀스로

        //this.result = { madeLevel="", madeExtra="", resultList, }
        //madeExtra는 같은 메이드끼리 비교를 위한 추가 정보 정의가 필요함
        //result List는 isShow로 다섯장추린 거 보스 체크 시에는 필요없고, 카드 개수 파악해서 7장일때만 처리하면됨
        //resultList를 showList로 이름 변경
    }


    compare(target)  {
        if(target.result.madeLevel > this.result.madeLevel) {
            return true;
        } else if(target.result.madeLevel < this.result.madeLevel) {
            return false;
        } else {
            if(this.result.madeLevel == 1) {
                if(this.result.madeExtra > target.result.madeExtra) {
                    return true;
                } else {
                    return false;
                }
            }
            //todo : add else if cases
        }
        // this.result VS target.result  if win ? true : false
    }
}