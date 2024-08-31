function s(int){
    return String(int)
}

function i(str){
    return parseInt(str)
}

function renderchessboard(){
    let chessboard = document.getElementById('chessboard')
    chessboard.innerHTML = ''

    let tr = document.createElement('tr')

    legalmoves = listlegalmoves()
    legalmovesfromhighlightedsquare = []

    for (let lm=0; lm<legalmoves.length; lm++){
        if (legalmoves[lm][0] == highlightedsquare){
            legalmovesfromhighlightedsquare.push(legalmoves[lm][1])
        }
    }

    for (let y=0; y<8; y++){
        tr = document.createElement('tr')

        let span = document.createElement('span')
        span.innerHTML = y
        span.classList = 'sidetext'
        tr.appendChild(span)

        for (let x=0; x<8; x++){
            let button = document.createElement('button')
            button.innerHTML = '<b>' + String(position[y*10+x]) + '</b>'
            button.classList = 'button '
            button.addEventListener("click", () => onclicksquare(x, y))

            if (y*10+x == highlightedsquare){
                button.classList += 'highlightedsquare'
            } else {
                if ((x + y) % 2 == 0){
                    button.classList += 'whitebackground'
                } else {
                    button.classList += 'blackbackground'
                }
            }

            if (legalmovesfromhighlightedsquare.includes(y*10+x)){
                button.classList = 'button possiblemovesquare'
            }
            
            tr.appendChild(document.createElement('th').appendChild(button))
        }

        chessboard.appendChild(tr)
    }

    tr = document.createElement('tr')

    for (let x=0; x<8; x++){ // quickly thrown together because I am an idiot
        if (x == 0){
            let span = document.createElement('span')
            span.innerHTML = '+'
            span.classList = 'sidetext'
            
            tr.appendChild(document.createElement('th').appendChild(span))
        }

        let span = document.createElement('span')
        span.innerHTML = x
        span.classList = 'sidetext'
        
        tr.appendChild(document.createElement('th').appendChild(span))
    }

    chessboard.appendChild(tr)
}

function listlegalmoves(repeated=false){
    let legalmoves = []

    for (let y=0; y<8; y++){
        for (let x=0; x<8; x++){
            let coords = y*10+x
            let piece = position[coords][1]
            let color = position[coords][0]

            if (piece == ''){
                continue
            }

            if (color == 'w' && !whitesturn){
                continue
            }

            if (color == 'b' && whitesturn){
                continue
            }

            let notcolor = ''

            if (color == 'w'){
                notcolor = 'b'
            } else if (color == 'b'){
                notcolor = 'w'
            }

            if (piece == 'p'){
                if (color == 'w'){
                    if (position[coords-10] == ''){
                        legalmoves.push([coords, coords-10])

                        if (y == 6 && position[coords-20] == ''){
                            legalmoves.push([coords, coords-20])
                        }
                    }
                    
                    if (x != 7){
                        if (position[coords-9][0] == 'b' || ((x)+1 == enpassant && colorenpassant == 'b')){
                            legalmoves.push([coords, coords-9])
                        }
                    }

                    if (x != 0){
                        if (position[coords-11][0] == 'b' || ((x)-1 == enpassant && colorenpassant == 'b')){
                            legalmoves.push([coords, coords-11])
                        }
                    }
                }

                if (color == 'b'){
                    if (position[coords+10] == ''){
                        legalmoves.push([coords, coords+10])

                        if (y == 1 && position[coords+20] == ''){
                            legalmoves.push([coords, coords+20])
                        }
                    }
                    
                    if (x != 0){
                        if (position[coords+9][0] == 'w' || ((x)-1 == enpassant && colorenpassant == 'w')){
                            legalmoves.push([coords, coords+9])
                        }
                    }

                    if (x != 7){
                        if (position[coords+11][0] == 'w' || ((x)+1 == enpassant && colorenpassant == 'w')){
                            legalmoves.push([coords, coords+11])
                        }
                    }
                }
            }
            
            if (piece == 'r' || piece == 'b' || piece == 'q'){
                let continueloop = true
                let j = 0

                let offsets = [1, -1, 10, -10, 11, -11, 9, -9]

                for (let deg=0; deg<8; deg++){
                    if (piece == 'b' && deg < 4){
                        deg = 4
                    }

                    if (piece == 'r' && deg > 3){
                        break
                    }

                    continueloop = true
                    j = 0

                    while (continueloop){
                        j += offsets[deg]
                        
                        if (!isinbounds(coords+j)){
                            continueloop = false
                            continue
                        }

                        if (position[coords+j][0] == color){
                            continueloop = false
                            continue
                        }

                        if (position[coords+j][0] == notcolor){
                            continueloop = false
                        }

                        legalmoves.push([coords, coords+j])
                    }
                }
            }
            
            if (piece == 'n'){
                let numberchanges = [-21, -19, -12, -8, 21, 19, 12, 8]
                let numberchange = 0

                for (let j=0; j<numberchanges.length; j++){
                    numberchange = numberchanges[j]

                    if (!isinbounds(coords + numberchange)){
                        continue
                    }
                    
                    if (position[coords+numberchange][0] != color){
                        legalmoves.push([coords, coords+numberchanges[j]])
                    }
                }
            }

            if (piece == 'k'){
                let numberchanges = [-11, -10, -9, -1, 1, 9, 10, 11]
                let numberchange = 0

                for (let j=0; j<numberchanges.length; j++){
                    numberchange = numberchanges[j]

                    if (!isinbounds(coords + numberchange)){
                        continue
                    }
                    
                    if (position[coords+numberchange][0] != color){
                        legalmoves.push([coords, coords+numberchanges[j]])
                    }
                }
            }
        }
    }

    if (!repeated){
        let kingsposition = 100

        for (let l=0; l < legalmoves.length; l++){
            const backupposition = [...position]

            domove(legalmoves[l][0], legalmoves[l][1])

            for (let y=0; y<8; y++){
                for (let x=0; x<8; x++){
                    if (position[y*10+x][1] == 'k'){
                        if (whitesturn){
                            if (position[y*10+x][0] == 'b'){
                                kingsposition = y*10+x
                                break
                            }
                        } else {
                            if (position[y*10+x][0] == 'w'){
                                kingsposition = y*10+x
                                break
                            }
                        }
                    }
                }
            }

            if (isattacked(kingsposition, false)){
                legalmoves.splice(l, 1)
                l--
            }

            whitesturn = !whitesturn

            position = backupposition
        }
    }

    return legalmoves
}

function isinbounds(where){
    if (where < 0 || where >= 80){
        return false
    }

    if (where % 10 > 7){
        return false
    }

    return true
}

function moveinarray(arr, item){
    for (let i=0; i<arr.length; i++){
        if (arr[i][0] == item[0] && arr[i][1] == item[1]){
            return true
        }
    }
    return false
}

function onclicksquare(x, y){
    if (y*10+x == highlightedsquare){
        highlightedsquare = 100
    } else {
        if (highlightedsquare == 100){
            highlightedsquare = y*10+x
        } else {
            let legalmoves = listlegalmoves()
            console.log(legalmoves)

            if (moveinarray(legalmoves, [highlightedsquare, y*10+x])){
                domove(highlightedsquare, y*10+x, true)
            }

            highlightedsquare = 100
        }
    }

    renderchessboard()
}

function domove(from, to, forreal=false){
    if (position[from] == 'wp' && (from - 9 == to || from - 11 == to) && position[to+10] == 'bp'){
        // en passant

        position[to+10] = ''
    } else if (position[from] == 'bp' && (from + 9 == to || from + 11 == to) && position[to-10] == 'wp'){
        // en passant

        position[to-10] = ''
    } else {
        enpassant = 8
        colorenpassant = ''
    }

    if (position[from][1] == 'k'){
        if (position[from][0] == 'w'){
            whitescastles = []
        } else {
            blackscastles = []
        }
    }

    position[to] = position[from]
    position[from] = ''

    if (turnsystem){
        whitesturn = !whitesturn
    }
        
    if (position[to] == 'wp' && from - 20 == to){
        enpassant = to%10
        colorenpassant = 'w'
    }

    if (position[to] == 'bp' && from + 20 == to){
        enpassant = to%10
        colorenpassant = 'b'
    }

    if (forreal){
        if (listlegalmoves().length == 0){
            let kingsposition = 100

            for (let p=0; p<position.length; p++){
                if (position[p][1] == 'k'){
                    if (whitesturn){
                        if (position[p][0] == 'w'){
                            kingsposition = p
                            break
                        }
                    } else {
                        if (position[p][0] == 'b'){
                            kingsposition = p
                            break
                        }
                    }
                }
            }

            console.log(kingsposition)

            if (isattacked(kingsposition)){
                if (whitesturn){
                    document.getElementById('gamestate').innerHTML = 'Checkmate! Black wins!'
                } else {
                    document.getElementById('gamestate').innerHTML = 'Checkmate! White wins!'
                }
            } else {
                document.getElementById('gamestate').innerHTML = 'Stalemate! Draw!'
            }
        }
    }
}

function isattacked(space, onnextturn=true){
    if (onnextturn){
        whitesturn = !whitesturn
    }

    let secondlegalmoves = listlegalmoves(true)

    for (let j=0; j < secondlegalmoves.length; j++){
        if (secondlegalmoves[j][1] == space){
            if (onnextturn){
                whitesturn = !whitesturn
            }

            return true  
        }
    }
    
    if (onnextturn){
        whitesturn = !whitesturn
    }

    return false
}

let turnsystem = true // turn off when debugging

let highlightedsquare = 100

let whitesturn = true

let enpassant = 8
let colorenpassant = ''

let whitescastles = [80, 88]
let blackscastles = [0, 8]

let position = ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br' ,'', '',
                'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp' ,'', '', 
                '',   '',   '',   '',   '',   '',   '',   '',   '', '',
                '',   '',   '',   '',   '',   '',   '',   '',   '', '',
                '',   '',   '',   '',   '',   '',   '',   '',   '', '',
                '',   '',   '',   '',   '',   '',   '',   '',   '', '',
                'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', '', '', 
                'wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr', '', '']

renderchessboard()
