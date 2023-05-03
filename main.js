let app = new Vue({
    el: '#app',
    data: {
        cards: [
            {
                name: 'Apple',
                img: 'apple.gif',

            },
            {
                name: 'Banana',
                img: 'banana.gif',

            },
            {
                name: 'Orange',
                img: 'orange.jpg',

            },
            {
                name: 'Pineapple',
                img: 'pineapple.png',

            },
            {
                name: 'Strawberry',
                img: 'strawberry.png',

            },
            {
                name: 'watermelon',
                img: 'watermelon.jpg',

            },
        ],
        //array con coppia di carte
        memoryCards: [],
        //array con carte girate
        flippedCards: [],

        finish: false,
        start: false,
        turns: 0,
        totalTime: {
            minutes: 0,
            seconds: 0,
        },
    },

    created() {
        //per ogni carta imposto variabile classe per girare le carte
        this.cards.forEach((card) => {
            Vue.set(card, 'isFlipped', false);
            Vue.set(card, 'isMatched', false);
        });

        //metodo libreria lodash, con shuflle mescola elemtni degli array e concatena due copie dell'array cards e cloneDeep clona gli oggetti all'interno dell'array, in modo da non manipolare gli oggetti originali.
        this.memoryCards = _.shuffle(this.memoryCards.concat(_.cloneDeep(this.cards), _.cloneDeep(this.cards)));

        this.reset();
    },

    computed: {
        sec() {
            if (this.totalTime.seconds < 10) {
                return '0' + this.totalTime.seconds;
            }
            return this.totalTime.seconds;
        },
        min() {
            if (this.totalTime.minutes < 10) {
                return '0' + this.totalTime.minutes;
            }
            return this.totalTime.minutes;
        }
    },

    methods: {
        // se clicchi sulla carta diventa true e si gira la carta 
        flipCard(card) {

            if (!this.start) {
                this._startGame();
            }

            if (card.isMatched || card.isFlipped || this.flippedCards.length === 2)
                return;

            card.isFlipped = true;

            if (this.flippedCards.length < 2)
                this.flippedCards.push(card);
            if (this.flippedCards.length === 2)
                this._match(card);
        },

        _match(card) {

            this.turns++;

            if (this.flippedCards[0].name === this.flippedCards[1].name) {
                setTimeout(() => {
                    this.flippedCards.forEach(card => card.isMatched = true);
                    this.flippedCards = [];

                    //se tute le carte sono matchate il gioco è finito
                    if (this.memoryCards.every(card => card.isMatched === true)) {
                        clearInterval(this.interval);
                        this.finish = true;
                    }

                }, 400);
            }
            else {
                setTimeout(() => {
                    this.flippedCards.forEach((card) => { card.isFlipped = false });
                    this.flippedCards = [];
                }, 800);
            }
        },

        _startGame() {
            this._tick();
            this.interval = setInterval(this._tick, 1000);
            this.start = true;
        },

        _tick() {
            if (this.totalTime.seconds !== 59) {
                this.totalTime.seconds++;
                return
            }

            this.totalTime.minutes++;
            this.totalTime.seconds = 0;
        },

        reset() {
            clearInterval(this.interval);

            this.cards.forEach((card) => {
                Vue.set(card, 'isFlipped', false);
                Vue.set(card, 'isMatched', false);
            });

            setTimeout(() => {
                this.memoryCards = [];
                this.memoryCards = _.shuffle(this.memoryCards.concat(_.cloneDeep(this.cards), _.cloneDeep(this.cards)));
                this.totalTime.minutes = 0;
                this.totalTime.seconds = 0;
                this.start = false;
                this.finish = false;
                this.turns = 0;
                this.flippedCards = [];

            }, 600);

        },
    }
});