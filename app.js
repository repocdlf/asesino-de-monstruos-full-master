new Vue({
    el: '#app',
    data: {
        saludJugador: 100,
        saludMonstruo: 100,
        hayUnaPartidaEnJuego: false,
        turnos: [], //es para registrar los eventos de la partida
        esJugador: false,
        rangoAtaque: [3, 10],
        rangoAtaqueEspecial: [10, 20],
        rangoAtaqueDelMonstruo: [5, 12],
    },

    methods: {
        getSalud(salud) {
            return `${salud}%`
        },

        empezarPartida: function () {
            this.hayUnaPartidaEnJuego = true;
            this.saludJugador = 100;
            this.saludMonstruo = 100;
            this.turnos = [];
        },

        atacar: function () {
            this.esJugador = true;
            var damage = this.calcularHeridas(this.rangoAtaque);
            this.saludMonstruo -= damage;
            this.registrarEvento('El jugador golpea al monstruo por ' + damage);
            if (this.verificarGanador()){
                return;
            }
            this.ataqueDelMonstruo();
        },

        ataqueEspecial: function () {
            this.esJugador = true;
            var damage = this.calcularHeridas(this.rangoAtaqueEspecial);
            this.saludMonstruo -= damage;
            this.registrarEvento('El jugador golpea al monstruo en ataque especial por ' + damage);
            if (this.verificarGanador()){
                return;
            }
            this.ataqueDelMonstruo();
        },

        curar: function () {
            this.esJugador = true;
            var delta = 0;
            if (this.saludJugador <= 90){
                this.saludJugador += 10;
                delta = 10;
            } else {
                delta = 100 - this.saludJugador;
                this.saludJugador = 100;
            }
            this.registrarEvento('El jugador recupera su salud en ' + delta);
            this.ataqueDelMonstruo();
        },

        registrarEvento(evento) {
            this.turnos.unshift({
                esJugador: this.esJugador,
                text: evento
            })
        },

        terminarPartida: function () {
            this.hayUnaPartidaEnJuego = false;
        },

        ataqueDelMonstruo: function () {
            this.esJugador = false;
            var damage = this.calcularHeridas(this.rangoAtaqueDelMonstruo);
            this.saludJugador -= damage;
            this.registrarEvento('El monstruo lastima al jugador en ' + damage);
            this.verificarGanador();
        },

        calcularHeridas: function (rango) {
            return Math.max(Math.floor(Math.random() * rango[1] ) + 1, rango[0]);
        },

        verificarGanador: function () {
            if (this.saludMonstruo <= 0){
                if (confirm('Ganaste!, Jugar de nuevo?')){
                    this.empezarPartida();
                } else {
                    this.hayUnaPartidaEnJuego = false;
                }
                return true;
            } else if (this.saludJugador <= 0){
                if (confirm('Perdiste!, Jugar de nuevo?')){
                    this.empezarPartida();
                } else {
                    this.hayUnaPartidaEnJuego = false;
                }
                return true;
            }
            return false;
        },

        cssEvento(turno) {
            //Este return de un objeto es prque vue asi lo requiere, pero ponerlo acá queda mucho mas entendible en el codigo HTML.
            return {
                'player-turno': turno.esJugador,
                'monster-turno': !turno.esJugador
            }
        }
    }
});