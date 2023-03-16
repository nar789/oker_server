
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
        for(var u of userList) {
            this.userCard.get(u).push(this.cards.openPop());
            userCard2[u] = [];
            for(var c of this.userCard.get(u)) {
                if(c.isShow) {
                    userCard2[u].push(c);
                }
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
        //isShow true기준으로 누가 보스인지 체크해서 보내기
        let bossId = this.whosTheBoss(userList, userCard2);
        console.log("boss is " + bossId);
        io.sockets.in(roomId).emit('boss', {
            bossId : bossId
        });
        console.log('BOSS END');

        
        //betting??
        
        
        if(this.turn == 7) {
            this.gameOver(io, userList, userCard);
        }
    }


    whosTheBoss(userList, userCard) {
        for(var u of userList) {
            let cards = userCard.get(u);
            let r1 = new Result(cards);
            let win = 0;
            
            r1.calc();
            for(var u2 of userList) {
                if(u == u2) {
                    continue;
                }
                let cards2 = userCard.get(u2);
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
    }


    betting() {
        //usreList 누구가 어떤 베팅을 했는지
        //betting 정보 업데이트 
        //각자 베팅금액이 같은지 아니면 누구차례고 어떤베팅상태인지 전달
        //BettingInfo (누구차례인지 각자 콜값들, 총 베팅금액 / 금방베팅한금액 / 어떤베팅이가능한지 상태)
        //베팅금액이 전부 같으면 sevenTurn()
    }

    gameOver(io, userList, userCard) {

        //userCard 로 calc() 해서  resultList를 만들고, winner찾은 다음에 emit용 json만들어서 room으로 emit()
        //io.sockets.in(roomId).emit resultList & winnerUserId

    }

}