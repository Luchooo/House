var io 			= require("socket.io").listen(8089, {log: false});
var five 		= require("johnny-five");
var board 		= new five.Board();


var leds		= [0, 0, 0];
var numLeds		= [13, 6, 5];
var estadoLeds	= [0, 0, 0]; //Todos los leds están apagados...

var conStrobe	= 0; //Saber si tendrá el efecto Strobe...
var velocidadStrobe = 0;
//Conexión con la tarjeta de Arduino y asignación de valores...
board.on("ready", function()
{ 
	console.log("Johnny5 listo y escuchando!!");
	for(var i in leds)
	{
		leds[i] = new five.Led(numLeds[i]);
	}
});

//UID -> Dispostivo...
io.on("connection", function(socket)
{
	socket.on("conecta", function(data)
	{
		console.log("Se ha conectado el usuario: " + data.id);
	});

	socket.on("enciendeApaga", function(data)
	{
		velocidadStrobe = data.velocidadStrobe;
		console.log("velocidadStrobe: " + velocidadStrobe);
		if(data.estado) //1 -> Encendido...
		{
			if(!conStrobe) //-> Si no tiene Strobe...
			{
				leds[data.led].on(); // -> Encender...
			}
			else
			{
				leds[data.led].strobe(velocidadStrobe);
			}
		}
		else
		{
			if(!conStrobe)
			{
				leds[data.led].off();	
			}
			else
			{
				leds[data.led].stop().off();
			}
		}
		estadoLeds[data.led] = data.estado;
	});

	socket.on("strobe", function(data)
	{
		//Buscar los leds que estén encendidos y aplicar el cambio...
		conStrobe = data.strobe;
		velocidadStrobe = data.velocidadStrobe;
		console.log("Otro: " + velocidadStrobe + " Strobe: " + conStrobe);
		for(var i in estadoLeds)
		{
			if(estadoLeds[i] === 1)
			{
				leds[i].stop().off();
				if(conStrobe)
				{
					leds[i].strobe(velocidadStrobe);
				}
				else
				{
					leds[i].on();
				}
			}
		}
	});
});
console.log("Servidor arriba a través del puerto 8089");