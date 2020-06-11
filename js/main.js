var coordinates = function(x,y,z)
{
	this.x = x;
	this.y = y;
	this.z = z;
}

var imageIconArray = {};
var infospotNameList = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,44,45,46,47,48,50,51,52,53,54,55,60,61,65,66,67,68,69,70];
var audioFileList = [2,3,9,14,17,18,22,23,24,26,27,30,32,33,34,45,65,66,68];

var ShipDeck = function()
{
	this.infoLinkdict = {};
	this.progress;
	this.progressElement;
	this.PanoList = [];
	this.infoPointSize = 600;
	this.initialize = function(data)
	{
		this.dataJson = data;
		var count = 0;
		var obj = this;
		for(var i=0; i < infospotNameList.length; i++)
		{
			var iconName = infospotNameList[i].toString();
			preloadImages(iconName,function(e){
				count++;
				imageIconArray[e.currentTarget.class] = getDataUrl(e.currentTarget);
				if(count == infospotNameList.length)
				{
					console.info(infospotNameList.length);
					obj.CreatePano();
					
				}
			});
		}
	}
	
	this.CreatePano = function()
	{
		this.progressElement = document.getElementById('progress');
		this.viewer = new PANOLENS.Viewer({clickTolerance:0, cameraFov:80, enableReticle: false,   /* output: 'console', */  viewIndicator: true, autoRotate: false, autoRotateSpeed: 2, autoRotateActivationDuration: 5000, dwellTime: 2000 });//cameraFov zoom of camera
		this.CreateImagePanorama();
		this.CreateInfoLinks();
		/* if(getMobileOperatingSystem() != "unknown")
		{
			//this.viewer.enableControl(1);		
		} */ 
	}
	
	this.CreateImagePanorama = function()
	{
		for(var i=0; i < this.dataJson.scenes.length; i++)
		{
			var sceneObj = this.dataJson.scenes[i];
			var panorama = new PANOLENS.ImagePanorama("./images/"+sceneObj.image);
			panorama.name = sceneObj.sceneName;
			panorama.addEventListener( 'progress', onProgress );
			//panorama.setLinkingImage(imageIconArray[sceneObj.sceneName],600);
			panorama.addEventListener( 'enter', onEnter );
			this.viewer.add( panorama );
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
			if(i == 0 && mobileOperatingSystem == "iOS" && parseInt(this.sceneJson.sceneName) > 4)
			{
				var infoPoint = new InfoPoint();
				var tempjson = '{"infoPointsName":'+infoLinkObj.infoPointsName.toString()+',"infoPointsCoordinates":[379343.74,-1796.61,-2707.11],"infoHoverText":'+infoLinkObj.infoPointsName.toString()+'}';
				infoPoint.initialize(this.infoLinkdict , this.sceneJson.sceneName , JSON.parse(tempjson));
			}
			var infoPoint1 = new InfoPoint();
			infoPoint1.initialize(this.infoLinkdict , this.sceneJson.sceneName , infoLinkObj);
			this.infoPointdict[infoLinkObj.infoPointsName] = infoPoint1;
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
		var iconName = this.infoLink.infoPointsName;
		this.panorama.link( this.infoLinkdict[iconName], new THREE.Vector3( this.infoLink.infoPointsCoordinates[0], this.infoLink.infoPointsCoordinates[1], this.infoLink.infoPointsCoordinates[2] ) , this.infoPointSize , imageIconArray[iconName] , this.HoverText);
	}
}

function getDataUrl(img) {
   // Create canvas
   const canvas = document.createElement('canvas');
   const ctx = canvas.getContext('2d');
   // Set width and height
   canvas.width = img.width;
   canvas.height = img.height;
   // Draw the image
   ctx.drawImage(img, 0, 0);
   return canvas.toDataURL('image/png');
}

function preloadImages(imageName , calback)
{
	var img=new Image();
    img.src="./Logo/"+imageName+".png";
	img.class = imageName;
	img.onload = calback;
}