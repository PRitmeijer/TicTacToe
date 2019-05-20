# Tic Tac Toe

board = [' ' for x in range(9)]


def insertLetter(letter, pos):
    board[pos] = letter


def spaceIsFree(pos):
    return board[pos] == ' '


def printBoard():
    print(board[0] + " | " + board[1] + " | " + board[2])
    print(board[3] + " | " + board[4] + " | " + board[5])
    print(board[6] + " | " + board[7] + " | " + board[8])


def isWinner(board, letter):
    return(board[6] == letter and board[7] == letter and board[8] == letter) or\
          (board[3] == letter and board[4] == letter and board[5] == letter) or\
          (board[0] == letter and board[1] == letter and board[2] == letter) or\
          (board[0] == letter and board[3] == letter and board[6] == letter) or\
          (board[1] == letter and board[4] == letter and board[7] == letter) or\
          (board[2] == letter and board[5] == letter and board[8] == letter) or\
          (board[0] == letter and board[4] == letter and board[8] == letter) or\
          (board[2] == letter and board[4] == letter and board[6] == letter)


def playerMove():
    run = True
    while run:
        move = input('Please select a position to place an X (1-9: ')
        try:
            move = int(move) - 1
            if move > -1 and move <9:
                if spaceIsFree(move):
                    run = False
                    insertLetter('X', move)
                else:
                    print('This place is occupied.')
            else:
                print('Please type a number between 1-9')
        except:
            print('Please type a number')


def compMove():
    possibleMoves = [x for x, letter in enumerate(board) if letter == ' ']
    move = 9

    for letter in ['O', 'X']:
        for i in possibleMoves:
            boardCopy = board[:]
            boardCopy[i] = letter
            if isWinner(boardCopy, letter):
                move = i
                return move

    cornersOpen = []
    for i in possibleMoves:
        if i in [0,2,6,8]:
            cornersOpen.append(i)
    if len(cornersOpen) > 0:
        move = selectRandom(cornersOpen)
        return move

    if 5 in possibleMoves:
        move = 4
        return move

    edgesOpen = []
    for i in possibleMoves:
        if i in [1,3,5,7]:
            edgesOpen.append(i)

    if len(edgesOpen) > 0:
        move = selectRandom(edgesOpen)

    return move



def selectRandom(li):
    import random
    ln = len(li)
    r = random.randrange(0, ln)
    return li[r]


def isBoardFull(board):
    if board.count(' ') > 1:
        return False
    else:
        return True


def main():
    print('Welcome to Tic Tac Toe!')
    printBoard()

    while not(isBoardFull(board)):
        if not(isWinner(board, 'O')):
            playerMove()
            printBoard()
        else:
            print('Sorry, you lost!')
            break
        if not(isWinner(board, 'X')):
            move = compMove()
            if move == 9:
                print('Tie Game!')
            else:
                insertLetter('O', move)
                print('Computer placed an O in position', int(move) + 1)
                printBoard()
        else:
            print('Congratulations, you won!')
            break

    if isBoardFull(board):
        print('Tie Game!')


main()


