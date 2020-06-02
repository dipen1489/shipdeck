var coordinates = function(x,y,z)
{
	this.x = x;
	this.y = y;
	this.z = z;
}

var ShipDeck = function()
{
	this.infoLinkdict = {};
	this.progress;
	this.progressElement;
	this.PanoList = [];
	this.initialize = function(data)
	{
		this.dataJson = data;
		this.progressElement = document.getElementById('progress');
		this.viewer = new PANOLENS.Viewer({clickTolerance:0, cameraFov:100, enableReticle: false,  /* output: 'console', */ viewIndicator: true, autoRotate: false, autoRotateSpeed: 2, autoRotateActivationDuration: 5000, dwellTime: 1000 });//cameraFov zoom of camera
		this.CreateImagePanorama();
		this.CreateInfoLinks();
		//this.viewer.enableEffect(2);
		if(getMobileOperatingSystem() != "iOS")
		{
			this.viewer.widget.EnableDisableFullScreen();
		}	
	}
	
	this.CreateImagePanorama = function()
	{
		for(var i=0; i < this.dataJson.scenes.length; i++)
		{
			var sceneObj = this.dataJson.scenes[i];
			var panorama = new PANOLENS.ImagePanorama("./images/"+sceneObj.image);
			panorama.name = sceneObj.sceneName;
			panorama.addEventListener( 'progress', onProgress );
			panorama.addEventListener( 'enter', onEnter );
			this.viewer.add( panorama );
			if(sceneObj.sceneName == "34")
				this.viewer.setPanorama(panorama);
			this.infoLinkdict[sceneObj.sceneName] = panorama;
			this.PanoList.push(sceneObj.sceneName);
		}
	}

	this.CreateInfoLinks = function()
	{
		for(var i=0; i < this.dataJson.scenes.length; i++)
		{
			var sceneObj = this.dataJson.scenes[i];
			var infoLinks = new InfoLinks();
			infoLinks.initialize(this.infoLinkdict, sceneObj);
		}
	}
}

var InfoLinks = function()
{
	this.infoPointdict = {};
	this.infoLinkdict = {};
	this.initialize = function(dict , sceneObj)
	{
		this.infoLinkdict = dict;
		this.sceneJson = sceneObj;
		this.createInfoLink();
	}
	
	this.createInfoLink = function()
	{
		for(var i=0; i < this.sceneJson.infoPoints.length; i++)
		{
			var infoLinkObj = this.sceneJson.infoPoints[i];
			var infoPoint = new InfoPoint();
			infoPoint.initialize(this.infoLinkdict , this.sceneJson.sceneName , infoLinkObj);
			this.infoPointdict[infoLinkObj.infoPointsName] = infoPoint;
		}
	}
}

var InfoPoint = function()
{
	this.infoPointSize = 600;
	this.infoLinkdict = {};
	this.initialize = function(dict , sceneName, infoLink)
	{
		this.infoLinkdict = dict;
		this.sceneName = sceneName;
		this.infoLink = infoLink;
		this.panorama = dict[sceneName];
		this.HoverText = infoLink.infoHoverText;
		this.createInfoSpot();
	}
	
	this.createInfoSpot = function()
	{
		/* console.info( "infoPointsName : "+this.infoLink.infoPointsName );
		console.info( "infoLinkdict : -------------------------- ");
		console.info(this.infoLinkdict.length);
		console.info("X : "+this.infoLink.infoPointsCoordinates[0]);
		console.info("Y : "+this.infoLink.infoPointsCoordinates[1]);
		console.info("Z : "+this.infoLink.infoPointsCoordinates[2]);
		console.info("this.infoPointSize : "+this.infoPointSize);
		console.info("this.HoverText : "+this.HoverText); */
		
		this.panorama.link( this.infoLinkdict[this.infoLink.infoPointsName], new THREE.Vector3( this.infoLink.infoPointsCoordinates[0], this.infoLink.infoPointsCoordinates[1], this.infoLink.infoPointsCoordinates[2] ) , this.infoPointSize , false , this.HoverText);
	}
}