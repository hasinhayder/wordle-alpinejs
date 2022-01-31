const wordle = {
    todaysWord: possibilities[Math.floor((new Date() - new Date(2022, 0, 0)) / 8.64e7)],
    currentWordPosition: 0,
    offset: 0,
    offsetLock: 0,
    gameOver: false,
    locked: false,
    words: new Array(5).fill(null).map((x) => new Array(5).fill(null).map((x) => ({ value: '', match: false }))),
    
    getCurrentWordPosition() {
      //return current word array position
      return Math.floor(this.offset / 5)
    },

    clearCurrentWord() {
      //clear the current word in case of an invalid entry
      this.offset -= 5;
      this.words[this.currentWordPosition].map(x => {
        x.match = false
        x.value = '';
      })
    },
    
    processKey(event) {
      //process the keystrokes
      if (this.gameOver && event.key == "Enter") {
        this.restart()
      }

      if (this.gameOver || this.locked) {
        //no more keystroke processing if in locked state or if the game is over
        return
      }

      if (event.key == "Backspace") {
        //remove the last entered letter
        if (this.offset == this.offsetLock) {
          return
        }
        this.offset--
        this.currentWordPosition = this.getCurrentWordPosition()
        this.words[this.currentWordPosition][this.offset % 5].value = ""
      }

      if ("abcdefghijklmnopqrstuvwxyz".includes(event.key)) {
        //ok it's a valid alpha input
        this.currentWordPosition = this.getCurrentWordPosition()
        this.words[this.currentWordPosition][this.offset % 5].value = event.key
        if (this.offset % 5 == 4) {
          //current word array is filled up, so check if the entry matched
          this.match()
        }
        this.offset++

        if (this.offset == 25) {
          //input complete for all letters, game is over
          this.gameOver = true;
          return
        }
      }
    },
    
    match() {
      //process the current entry word
      this.offsetLock = this.currentWordPosition * 5 + 5
      const _words = this.words[this.currentWordPosition].map((x) => x.value)
      const _word = _words.join('')
      if (possibilities.includes(_word)) {
        //ok its a valid word
        for (index = 0; index < 5; index++) {
          if (this.todaysWord.includes(_words[index])) {
            //ok the letter is found somewhere - so it's a match. But is it an exact match? let's find out
            this.words[this.currentWordPosition][index].match = true;
            if (this.todaysWord.indexOf(_words[index]) == index) {
              //ok, even the offset of this letter is matched - so it's an exact match
              this.words[this.currentWordPosition][index].exactMatch = true;
            }
          }
        }

        if (this.todaysWord==_word) {
          //all letters matched
          this.gameOver = true;
        }
      } else {
        //not a valid word - so clean the word
        this.locked = true; //show the message
        let that = this;
        setTimeout(function () {
          that.clearCurrentWord()
          that.locked = false;
        }, 1000)
      }
    },
    
    restart() {
      //restart the game
      this.words = new Array(5).fill(null).map((x) => new Array(5).fill(null).map((x) => ({ value: '', match: false })))
      this.offset = 0;
      this.currentWordPosition = 0;
      this.gameOver = false;
    }
  }