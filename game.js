
const Result = require('./result');

module.exports = class Game {
    
    init() {
        this.cards = require('./card')();
        this.userCard = new Map();
        this.turn = 3;
    }

    choice(io, roomId, socketId, cards, userList) {
        console.log(`received choice by ${socketId}`);

        this.userCard.set(socketId, cards);

        console.log(this.userCard);

        if(this.userCard.size == userList.length) {
            //all choice complete 
            console.log("all choice complete!!");
            this.sevenTurn(io, roomId, userList);
        }
    }


    start(io, userList) {
        
        this.cards.init();
        this.cards.suffle();

        for(var u of userList) {

            let choiceCard = this.cards.choice();
            io.to(u).emit("choice", {
                cards : choiceCard
            });            
        } 
    }

    sevenTurn(io, roomId, userList) {
        this.turn += 1;
        console.log("sevenTurn(), turn = " + this.turn);

        //GIVE
        let userCard2 = {};
        let userCard3 = {};
        for(var u of userList) {
            this.userCard.get(u).push(this.cards.openPop());
            userCard2[u] = [];
            userCard3[u] = [];
            for(var c of this.userCard.get(u)) {
                if(c.isShow) {
                    userCard2[u].push(c);
                }
                userCard3[u].push(c);
            }
            
            io.to(u).emit('give_my_card_info', {
                cards : this.userCard.get(u)
            });
        }
        io.sockets.in(roomId).emit('give_user_card_info', {
            cards : userCard2
        });
        console.log('GIVE END');
        
        

        //BOSS
        let bossId = this.whosTheBoss(userList, userCard2);
        console.log("boss is " + bossId);
        io.sockets.in(roomId).emit('boss', {
            bossId : bossId
        });
        console.log('BOSS END');

        
        //BETTING
        //updateBettingInfo()
        
        
        
        //if(this.turn == 7) {
        if(this.turn == 5) {
            this.gameOver(io, userList, userCard3);
        }
    }


    whosTheBoss(userList, userCard) {
        for(var u of userList) {
            let cards = userCard[u];
            let r1 = new Result(cards);
            let win = 0;
            
            r1.calc();
            for(var u2 of userList) {
                if(u == u2) {
                    continue;
                }
                let cards2 = userCard[u2];
                let r2 = new Result(cards2);
                r2.calc();

                if(r1.compare(r2)) {
                    win += 1;
                }
            }
            if(win == userCard.size - 1) {
                return u;
            }
        }
        return 0;
    }

    updateBettingInfo(io, roomId, currentUserId, userList) {
        //역할 : 베팅정보 업데이트 / 누가 베팅 차례인지 브로드캐스트 / 베팅 금액 같으면 세븐턴 

        //callList : 유저별 베팅한 금액 
        //max call
        //betCntList : 유저별 베팅 가능 횟수 0이면 콜앤 다이밖에 할 수 없다.

        //콜리스트가 전부 같은 금액이고 일곱번째 턴 베팅이 아니면 this.sevenTurn()
        //전부 같은 금액이고 this.turn == 7이며 ㄴ게임오버
        //else  베팅info를 브로드캐스트  //io.sockets.in(roomId).emit  bettingInfo


        //클라이언트에서는 bettingInfo받아서 / 베팅 버튼 활성화

        
        //BettingInfo (누구차례인지 각자 콜값들, 총 베팅금액 / 금방베팅한금액 / 어떤베팅이가능한지 상태)

    }

    

    //누가 어떤 베팅을 했다 브로드캐스트 & updateBiettingInfo 다음 유저
    betting(io, roomId, userList, userId, type) {
        //클라로 받은 베팅 정보
        //베팅 한 정보 브로드캐스트 
        //다시 베팅 정보 업데이트 updateBettingInfo()
    }

    gameOver(io, userList, userCard) {

        
        let winner;
        for(var u of userList) {
            let cards = userCard[u];
            let r1 = new Result(cards);
            let win = 0;
            
            r1.calc();
            for(var u2 of userList) {
                if(u == u2) {
                    continue;
                }
                let cards2 = userCard[u2];
                let r2 = new Result(cards2);
                r2.calc();

                if(r1.compare(r2)) {
                    win += 1;
                }
            }
            if(win == userCard.size - 1) {
                winner = u;
            }
        }
        

        console.log(`winner is ${u}`);
        //userCard 로 calc() 해서  resultList를 만들고, winner찾은 다음에 emit용 json만들어서 room으로 emit()
        //io.sockets.in(roomId).emit resultList & winnerUserId

    }

}