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
	this.CurrentPanorama;
	this.lastPanorama;
	this.oldPanoList = [];
	
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
					obj.CreatePano();
				}
			});
		}
	}
	
	this.CreatePano = function()
	{
		//this.progressElement = document.getElementById('progress');
		this.viewer = new PANOLENS.Viewer({clickTolerance:0, cameraFov:80, enableReticle: false,   /* output: 'console', */  viewIndicator: true, autoRotate: false, autoRotateSpeed: 2, autoRotateActivationDuration: 5000, dwellTime: 2000 });//cameraFov zoom of camera
		this.CreateImagePanorama();
		$(".panolens-container").append('<div id="progressId" style="width: 100%;z-index:1000;" class="finish"></div>');
		progressElement = document.getElementById( 'progressId' );
	}
	
	this.LoadImagePanorama = function(panoname)
	{
		console.log("panoname : "+panoname);
		var sceneObj = this.infoLinkdict[panoname];
		this.CurrentPanorama = new PANOLENS.ImagePanorama("./images/"+sceneObj.image);
		this.CurrentPanorama.name = sceneObj.sceneName;
		currentPanoName = sceneObj.sceneName;
		this.CurrentPanorama.addEventListener( 'progress', onProgress );
		this.CurrentPanorama.addEventListener( 'enter', onEnter );
		
		for(var i=0; i < sceneObj.infoPoints.length; i++)
		{
			var infoLinkObj = sceneObj.infoPoints[i];
			var infoPoint = new InfoPoint();
			infoPoint.initialize(this , sceneObj.sceneName , infoLinkObj);
			//this.infoPointdict[infoLinkObj.infoPointsName] = infoPoint;
		}
		this.viewer.add( this.CurrentPanorama );
		this.viewer.setPanorama(this.CurrentPanorama);
		//PlayAudio(currentPanoName);
		this.oldPanoList.push(this.CurrentPanorama);
		if(this.oldPanoList.length > 5)
		{
			var lastPano = this.oldPanoList[0];
			lastPano && lastPano.dispose() && this.viewer.remove( lastPano );
			this.oldPanoList.shift();
		}
		
	}
	
	this.CreateImagePanorama = function()
	{
		for(var i=0; i < this.dataJson.scenes.length; i++)
		{
			var sceneObj = this.dataJson.scenes[i];
			this.infoLinkdict[sceneObj.sceneName] = sceneObj;
			this.PanoList.push(sceneObj.sceneName);
		}
	}
}

var InfoPoint = function()
{
	this.infoPointSize = 600;
	this.infospot;
	this.shipdeckObj;
	this.initialize = function(shipdeck , sceneName, infoLink)
	{
		this.sceneName = sceneName;
		this.infoLink = infoLink;
		this.shipdeckObj = shipdeck;
		this.panorama = this.shipdeckObj.CurrentPanorama;
		this.HoverText = infoLink.infoHoverText;
		this.createInfoSpot();
	}
	
	this.createInfoSpot = function()
	{
		var iconName = this.infoLink.infoPointsName;
		this.infospot = new PANOLENS.Infospot( this.infoPointSize, imageIconArray[iconName] );
		//this.infospot.addHoverText( iconName );
        this.infospot.position.set( this.infoLink.infoPointsCoordinates[0], this.infoLink.infoPointsCoordinates[1], this.infoLink.infoPointsCoordinates[2] );
		
		var shipdeck = this.shipdeckObj;
		this.infospot.addEventListener( 'click', function(){
			$(".panolens-infospot").css("display","none");
			shipdeck.LoadImagePanorama(iconName);
		});
		
		this.panorama.add(this.infospot);
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