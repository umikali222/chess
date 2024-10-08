class boardclass{
    constructor() {
        this.turnsystem = true // turn off for debugging


        this.highlightedsquare = 64

        this.whitesturn = true

        this.enpassant = '8'
        this.colorenpassant = ''

        this.position = ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br',
                         'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 
                         '',   '',   '',   '',   '',   '',   '',   '',   
                         '',   '',   '',   '',   '',   '',   '',   '',   
                         '',   '',   '',   '',   '',   '',   '',   '',   
                         '',   '',   '',   '',   '',   '',   '',   '',   
                         'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 
                         'wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']

        this.renderchessboard()
    }

    renderchessboard(){
        let chessboard = document.getElementById('chessboard')
        chessboard.innerHTML = ''
    
        let tr = document.createElement('tr')
        for (let i=0; i<64; i++){
            let button = document.createElement('button')
            button.innerHTML = '<b>' + String(this.position[i]) + '</b>'
            button.classList = 'button '
            button.addEventListener("click", () => onclicksquare(i))

            if (i == this.highlightedsquare){
                button.classList += 'highlightedsquare'
            } else {
                if (((i>>3) + (i%8)) % 2 == 0){
                    button.classList += 'whitebackground'
                } else {
                    button.classList += 'blackbackground'
                }
            }
    
            tr.appendChild(document.createElement('th').appendChild(button))
    
            if (i%8 == 7){
                chessboard.appendChild(tr)
                tr = document.createElement('tr')
            }
        }
    }

    ocs(id){
        if (id == this.highlightedsquare){
            this.highlightedsquare = 64
        } else {
            if (this.highlightedsquare == 64){
                this.highlightedsquare = id
            } else {
                let legalmoves = this.listlegalmoves()
                console.log(legalmoves)

                if (this.moveinarray(legalmoves, [parseInt(this.highlightedsquare), parseInt(id)])){

                    if (this.position[this.highlightedsquare] == 'wp' && (this.highlightedsquare - 7 == id || this.highlightedsquare - 9 == id) && this.position[id+8] == 'bp'){
                        // en passant

                        this.position[id+8] = ''
                    }

                    if (this.position[this.highlightedsquare] == 'bp' && (this.highlightedsquare + 7 == id || this.highlightedsquare + 9 == id) && this.position[id-8] == 'wp'){
                        // en passant

                        this.position[id-8] = ''
                    }


                    this.position[id] = this.position[this.highlightedsquare]
                    this.position[this.highlightedsquare] = ''

                    if (this.turnsystem){
                        this.whitesturn = !this.whitesturn
                    }
                        
                    if (this.position[id] == 'wp' && this.highlightedsquare - 16 == id){
                        this.enpassantrun('w', id%8)
                    }

                    if (this.position[id] == 'bp' && this.highlightedsquare + 16 == id){
                        this.enpassantrun('b', id%8)
                    }
                }

                this.highlightedsquare = 64
            }
        }

        this.renderchessboard()
    }

    listlegalmoves(){
        let legalmoves = []

        if (this.whitesturn && this.colorenpassant == 'w'){
            this.enpassant = 8
            this.colorenpassant = ''
        }

        if (!this.whitesturn && this.colorenpassant == 'b'){
            this.enpassant = 8
            this.colorenpassant = ''
        }

        

        for (let i=0;i<64;i++){

            let piece = this.position[i][1]
            let color = this.position[i][0]
            let notcolor = ''

            if (color == 'w'){
                notcolor = 'b'
            } else if (color == 'b'){
                notcolor = 'w'
            }

            if (piece == ''){
                continue
            }

            if (color == 'w' && !this.whitesturn){
                continue
            }

            if (color == 'b' && this.whitesturn){
                continue
            }

            if (piece == 'p'){
                if (color == 'w'){
                    if (this.position[i-8] == ''){
                        legalmoves.push([i, i-8])
                    }

                    if (i>>3 == 6){
                        if (this.position[i-16] == ''){
                            legalmoves.push([i, i-16])
                        }
                    }
                    
                    if (i%8 != 7){
                        if (this.position[i-7][0] == 'b' || ((i%8)+1 == this.enpassant && this.colorenpassant == 'b')){
                            legalmoves.push([i, i-7])
                        }
                    }

                    if (i%8 != 0){
                        if (this.position[i-9][0] == 'b' || ((i%8)-1 == this.enpassant && this.colorenpassant == 'b')){
                            legalmoves.push([i, i-9])
                        }
                    }
                }

                if (color == 'b'){
                    if (this.position[i+8] == ''){
                        legalmoves.push([i, i+8])
                    }

                    if (i>>3 == 1){
                        if (this.position[i+16] == ''){
                            legalmoves.push([i, i+16])
                        }
                    }
                    
                    if (i%8 != 0){
                        if (this.position[i+7][0] == 'w' || ((i%8)-1 == this.enpassant && this.colorenpassant == 'w')){
                            legalmoves.push([i, i+7])
                        }
                    }

                    if (i%8 != 7){
                        if (this.position[i+9][0] == 'w' || ((i%8)+1 == this.enpassant && this.colorenpassant == 'w')){
                            legalmoves.push([i, i+9])
                        }
                    }
                }
            }

            if (piece == 'r'){
                let continueloop = true
                let j = 0

                continueloop = true
                j = 0

                while (continueloop){
                    j++

                    if ((i+j) % 8 == 0  || i+j >= 64 || j > 8){
                        continueloop = false
                        continue
                    }
                    
                    if (this.position[i+j][0] == color){
                        continueloop = false
                        continue
                    } 
                    
                    if (this.position[i+j][0] == notcolor){
                        continueloop = false
                    }
                    
                    legalmoves.push([i, i+j])
                }

                continueloop = true
                j = 0

                while (continueloop){
                    j--

                    if ((i+j) % 8 == 7  || i+j < 0 || j < -8){
                        continueloop = false
                        continue
                    }
                    
                    if (this.position[i+j][0] == color){
                        continueloop = false
                        continue
                    } 
                    
                    if (this.position[i+j][0] == notcolor){
                        continueloop = false
                    }
                    
                    legalmoves.push([i, i+j])
                }

                continueloop = true
                j = 0

                while (continueloop){
                    j += 8

                    if (i+j >= 64){
                        continueloop = false
                        continue
                    }
                    
                    if (this.position[i+j][0] == color){
                        continueloop = false
                        continue
                    } 
                    
                    if (this.position[i+j][0] == notcolor){
                        continueloop = false
                    }
                    
                    legalmoves.push([i, i+j])
                }

                continueloop = true
                j = 0

                while (continueloop){
                    j -= 8

                    if (i+j < 0){
                        continueloop = false
                        continue
                    }
                    
                    if (this.position[i+j][0] == color){
                        continueloop = false
                        continue
                    } 
                    
                    if (this.position[i+j][0] == notcolor){
                        continueloop = false
                    }
                    
                    legalmoves.push([i, i+j])
                }
            }


            if (piece == 'n'){
                let numberchanges = [-6, 6, -15, 15, -17, 17, -10, 10]
                let numberchange = 0

                for (let j=0; j<numberchanges.length; j++){
                    numberchange = numberchanges[j]

                    if (i+numberchange >= 64 || i+numberchange < 0){
                        continue
                    }

                    if (numberchange == -6  && i%8 > 5 ){continue}
                    if (numberchange == 6   && i%8 < 2 ){continue}
                    if (numberchange == -15 && i%8 == 7){continue}
                    if (numberchange == 15  && i%8 == 0){continue}
                    if (numberchange == -17 && i%8 == 0){continue}
                    if (numberchange == 17  && i%8 == 7){continue}
                    if (numberchange == -10 && i%8 == 0){continue}
                    if (numberchange == 10  && i%8 == 7){continue}
                    
                    
                    if (this.position[i+numberchange][0] != color){
                        legalmoves.push([i, i+numberchanges[j]])
                    }
                }
            }
        }

        return legalmoves
    }

    enpassantrun(color, where){
        this.enpassant = where
        this.colorenpassant = color
    }

    moveinarray(arr, item){
        for (let i=0; i<arr.length; i++){
            if (arr[i][0] == item[0] && arr[i][1] == item[1]){
                return true
            }
        }
        return false
    }
}

function onclicksquare(id){
    board.ocs(id)
}



let board = new boardclass()

