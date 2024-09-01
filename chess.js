function s(int){
    return String(int)
}

/*function i(str){
    return parseInt(str)
}*/

function renderchessboard(buttonson=true){
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

        /*let span = document.createElement('span')
        span.innerHTML = y
        span.classList = 'sidetext'
        tr.appendChild(span)*/

        for (let x=0; x<8; x++){
            let button = document.createElement('button')
            //button.innerHTML = '<b>' + String(position[y*10+x]) + '</b>'

            if (position[y*10+x] != ''){
                button.innerHTML = '<img src="https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/' + s(position[y*10+x][0]) + s(position[y*10+x][1]).toUpperCase() + '.svg">'
            }

            button.classList = 'button '

            if (buttonson){
                button.addEventListener("click", () => onclicksquare(x, y))
            }

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

    /*for (let x=0; x<8; x++){ // quickly thrown together because I am an idiot
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

    chessboard.appendChild(tr)*/
}

function listlegalmoves(repeated=false, nocastle=false){
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
                        if (position[coords-9][0] == 'b' || (coords-9 == enpassant && colorenpassant == 'b')){
                            legalmoves.push([coords, coords-9])
                        }
                    }

                    if (x != 0){
                        if (position[coords-11][0] == 'b' || (coords-11 == enpassant && colorenpassant == 'b')){
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
                        if (position[coords+9][0] == 'w' || (coords+9  == enpassant && colorenpassant == 'w')){
                            legalmoves.push([coords, coords+9])
                        }
                    }

                    if (x != 7){
                        if (position[coords+11][0] == 'w' || (coords+11 == enpassant && colorenpassant == 'w')){
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


                if (!nocastle){
                    if (!isattacked(coords, true, true)){
                        // not in check

                        let castles = []

                        if (whitesturn){
                            castles = whitescastles
                        } else {
                            castles = blackscastles
                        }

                        for (let c=0; c<castles.length; c++){
                            let move = Math.ceil((castles[c] - coords)/4)

                            if (!isattacked(coords+move, true, true) && !isattacked(coords+move*2, true, true) && position[coords+move] == '' && position[coords+move*2] == ''){
                                legalmoves.push([coords, castles[c]])
                            }
                        }
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
    for (let m=0; m<arr.length; m++){
        if (arr[m][0] == item[0] && arr[m][1] == item[1]){
            return m
        }
    }
    return arr.length
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

            miaout = moveinarray(legalmoves, [highlightedsquare, y*10+x])

            if (miaout != legalmoves.length){
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
        if (forreal){
            enpassant = maxvalue
            colorenpassant = ''
        }
    }

    if (forreal){
        if (position[from][1] == 'k'){ // king move
            if (position[from][0] == 'w'){
                whitescastles = []
            } else {
                blackscastles = []
            }
        }

        if (position[from][1] == 'r'){
            if (whitescastles.includes(from)){ // rook move
                whitescastles.splice(whitescastles.indexOf(from), 1)
            }

            if (blackscastles.includes(from)){ // rook move
                blackscastles.splice(blackscastles.indexOf(from), 1)
            }
        }

        if (whitescastles.includes(to)){
            whitescastles.splice(whitescastles.indexOf(to), 1) // taking the rook
        }

        if (blackscastles.includes(to)){
            blackscastles.splice(blackscastles.indexOf(to), 1) // taking the rook
        }
        
        if (position[from] == 'wp' && from - 20 == to){
            enpassant = to + 10 ** (dimentions-1)
            colorenpassant = 'w'
        }

        if (position[from] == 'bp' && from + 20 == to){
            enpassant = to - 10 ** (dimentions-1)
            colorenpassant = 'b'
        }
    }

    if (position[from][1] == 'k' && position[to][1] == 'r' && position[from][0] == position[to][0]){
        // castle

        position[from + absolute1(to-from)] = position[to]
        position[to] = ''

        position[from + absolute1(to-from)*2] = position[from]
        position[from] = ''
    } else {
        position[to] = position[from]
        position[from] = ''
    }


    if (turnsystem){
        whitesturn = !whitesturn
    }

    if (forreal){
        let hash = JSON.stringify(position) // I was gonna hash it, but it turns out that you can't just make a function that outputs the sha256 hash of something,
                                            // no you have to make a function that is gonna return some weird type and it's super annoying

        boardhashes.push(hash)

        if (boardhashes.filter(x => x == hash).length == 3){
            document.getElementById('gamestate').innerHTML = 'Threefold repetition! Draw!'
            renderchessboard(false)
        }

        if (position.filter(x => x != '').length < 3){
            document.getElementById('gamestate').innerHTML = 'Insufficient material! Draw!'
            renderchessboard(false)
        }

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

            if (isattacked(kingsposition)){
                if (whitesturn){
                    document.getElementById('gamestate').innerHTML = 'Checkmate! Black wins!'
                } else {
                    document.getElementById('gamestate').innerHTML = 'Checkmate! White wins!'
                }
            } else {
                document.getElementById('gamestate').innerHTML = 'Stalemate! Draw!'
            }

            renderchessboard(false)
        }
    }
}

const getSHA256Hash = async (input) => {
    const textAsBuffer = new TextEncoder().encode(input);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", textAsBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray
        .map((item) => item.toString(16).padStart(2, "0"))
        .join("");
    return hash;
};
  

function howfaraway(from, to, mode1=false){
    let fmt = to-from

    let repetitions = 0

    while (true){
        if (Math.abs(fmt).toString().length == 1){
            if (mode1){
                fmt = 1
            }
            return fmt * (10 ** repetitions)
        }

        if (fmt.toString().includes('.')){
            console.log('If this runs, the code is broken')
            return
        }

        repetitions += 1
        fmt = fmt/10
    }
}

function absolute1(number){
    if (number.toString().includes('-')){
        return -1
    } else {
        return 1
    }
}

function isattacked(space, onnextturn=true, nocastled=false){
    if (onnextturn){
        whitesturn = !whitesturn
    }

    let secondlegalmoves = listlegalmoves(true, nocastled)

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

let dimentions = 2

let maxvalue = 10 ** dimentions

let turnsystem = true // turn off when debugging

let highlightedsquare = maxvalue

let whitesturn = true

let enpassant = maxvalue
let colorenpassant = ''

let whitescastles = [70, 77]
let blackscastles = [0, 8]

let position = ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br' ,'', '',
                'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp' ,'', '', 
                '',   '',   '',   '',   '',   '',   '',   '',   '', '',
                '',   '',   '',   '',   '',   '',   '',   '',   '', '',
                '',   '',   '',   '',   '',   '',   '',   '',   '', '',
                '',   '',   '',   '',   '',   '',   '',   '',   '', '',
                'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', '', '', 
                'wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr', '', '']

let boardhashes = [JSON.stringify(position)]

renderchessboard()
