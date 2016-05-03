window.onload = function()
{
	inicia();
};
//var debug = "";

function inicia()
{
	var serverBaseUrl = "http://localhost:8089";
    var socket = io.connect(serverBaseUrl);
    var sessionId = '';
    var conStrobe = 0;
    var tiempoAnima = "";
    var velocidadStrobe = 100;
    //var nombre = prompt("Por favor digita tu nombre");
    socket.on('connect', function ()
    {
        sessionId = socket.socket.sessionid;
        socket.emit('conecta', {id: sessionId});
    });
	//Para saber el estado de los elementos seleccionados...
	var leds = [
				{
					led : "amarillo",
					estado : 0
				},
				{
					led : "verde",
					estado : 0
				},
				{
					led : "rojo",
					estado : 0
				}];
	for(var i = 0; i <= 2; i++)
	{		
		nom_div("checkbox-10-" + i).addEventListener('change', function(event)
		{
        	//debug = this;        	
        	var ind = this.id.split("-");
        	//console.log(ind[2], Number(this.checked));
        	encenderApagar(Number(ind[2]), Number(this.checked));
    	});
	}

	var encenderApagar = function(led, estado)
	{
		//Almacenar el valor del led...
		leds[led].estado = estado;
		var colorEstado = estado === 0 ? "apagado" : "encendido"; //Operador Ternario...
		var estiloLed = leds[led].led + "_" + colorEstado;
		nom_div("led_" + leds[led].led).setAttribute("class", "baseleds " + estiloLed);
		//Se debe emitir el estado de los leds...
		var enviaSocket = {led: led, estado : estado, velocidadStrobe: velocidadStrobe};
		socket.emit('enciendeApaga', enviaSocket);
	};

	nom_div("checkbox-9-2").addEventListener('change', function(event)
	{
    	conStrobe = Number(this.checked);
    	if(!conStrobe)
    	{
    		for(var i in leds)
			{
			 	if(leds[i].estado === 1)
			 	{
					nom_div("led_" + leds[i].led).setAttribute("class", "baseleds " + leds[i].led + "_encendido");
				}
			}
    	}
    	var enviaSocket = {strobe: conStrobe, velocidadStrobe : velocidadStrobe};
    	socket.emit('strobe', enviaSocket);
    	//socket.emit('strobe', {strobe : conStrobe});
	});	

	nom_div("velStrobe").addEventListener('change', function(event)
	{
		velocidadStrobe = Number(this.value);
		var enviaSocket = {strobe: conStrobe, velocidadStrobe : velocidadStrobe};
    	socket.emit('strobe', enviaSocket);
		inciciaStrobe();
	});

	var inciciaStrobe = function()
	{
		if(tiempoAnima != "")
		{
			console.log("Ingresa");
			clearInterval(tiempoAnima);
		}
		tiempoAnima = setInterval(function()
		{
			if(conStrobe)
			{
				var tipoEstilo = "";
				var colorEstado = "";
				var estiloLed = "";
				for(var i in leds)
				{
				 	if(leds[i].estado === 1)
				 	{
					 	tipoEstilo = nom_div("led_" + leds[i].led).getAttribute("class").split(" ")[1].split("_")[1];
					 	colorEstado = tipoEstilo === "apagado" ? "encendido" : "apagado";
						estiloLed = leds[i].led + "_" + colorEstado;
						nom_div("led_" + leds[i].led).setAttribute("class", "baseleds " + estiloLed);
					}
				}
			}
		}, velocidadStrobe);
	};
	inciciaStrobe();
	//Para acceder a elementos de HTML...
	function nom_div(div)
	{
		return document.getElementById(div);
	}
}
