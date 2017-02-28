var chk = document.getElementsByName("filter"); // 체크박스객체를 담는다
var len = "0";
function checkNullName(str){
  if (str != null)
    return "<br><b>" + i18n.t('classes.name') + ": </b>" + str;
  else
    return "";
}

function checkNullClass(str){
  if (str != null)
    return "<br><b>" + i18n.t('classes.class') + ": </b>" + str;
  else
    return "";
}

function checkNullSubclass(str){
  if (str != null)
    return "<br><b>" + i18n.t('classes.subclass') + ": </b>" + str;
  else
    return "";
}

function isCommentEmpty(comment){
  if (comment == "")
    return "";
  else
    return "<b>" + i18n.t('classes.comment_popup') + ": </b>" + comment + "<br>";
}
function isImageEmpty(id, length){
  if (length == 0)
    return "";
  else
    return "<br><center><img src=localhost:5984//db_points_url/" + id + "/image.jpg" + " width=200px></center>";
}
function attachImage(length){
	if(length == "")
		return "";
	//console.log(length);
	var src = "data:image/jpeg;base64,";
	src += length;
	return "<br><center><img src= \"" + src + "\"  width=200px></center>";
}

function splitClasses(str, lang){
  var txt = "";
  if(lang=="it"){
    if(str=="civil_building")
      txt="edilizia civile";
    else if(str=="religious_building")
      txt="edilizia religiosa";
    else if(str=="rural_building")
      txt="edilizia rurale";
    else if(str=="military_building")
      txt="edilizia militare";
    else if(str=="museum")
      txt="museo";
    else if(str=="archeological_element")
      txt="elemento archeologico";
    else if(str=="factory")
      txt="opificio";
    else if(str=="support_for_traffic_artifacts")
      txt="supporto del traffico/manufatto";
    else if(str=="bounding_escarpment")
      txt="delimitazione/scarpata";
    else if(str=="surface")
      txt="superficie";
    else if(str=="transportation")
      txt="trasporto";
    else if(str=="service")
      txt="servizio";
    else if(str=="accommodation_overnight")
      txt="alloggio/pernottamento";
    else if(str=="food_service")
      txt="ristorazione";
    else if(str=="product")
      txt="prodotto";
    else if(str=="morphological_element")
      txt="elemento morfologico";
    else if(str=="structural_element")
      txt="elemento strutturale";
  }
  else{
    if (str == "support_for_traffic_artifacts")
      txt = "support for traffic/artifacts";
    else if (str == "bounding_escarpment")
      txt = "bounding/escarpment";
    else if (str == "accommodation_overnight")
      txt = "accommodation/overnight";
    else {
      var splitted = str.split("_");
      for (var i=0; i<splitted.length; i++) {
        txt += splitted[i];
        txt += " ";
      }
    }
  }
  return txt;
}

//visualizing POIs using marker cluster
function vizPOIs (map, odk, locations, classes, ratings, comments, ids, imageLength, lang){

  var markers_historical_cultural = L.markerClusterGroup();
  var markers_morphological = L.markerClusterGroup();
  var markers_touristic = L.markerClusterGroup();
  var markers_critical = L.markerClusterGroup();
  var marker_poi;
  var locationIcon;
  var location;
  var iconUrl_odk;
  var skipMarker = false;
  var checkCnt = 0;
  len = chk.length;

  for(var i=0; i<len; i++){
	  if(chk[i].checked == true){
		  checkCnt++;        //the number of checkbox
		//checkLast = i;     //체크된 체크박스의 인덱스
	  }
  }
  //console.log(len + ", " + checkCnt);
  if(checkCnt == 0){
	  //filtering = false;
  }  
  
  //historical-cultural elements
  for (var i = 0; i < classes.length; i++) {
    if (classes[i] == 'civil_building' || classes[i] == 'religious_building' || classes[i] == 'rural_building' || classes[i] == 'military_building' || classes[i] == 'museum' || classes[i] == 'archeological_element' || classes[i] == 'factory') {
      locationIcon = L.icon({
        iconUrl: 'css/lib/images/markers_class/'+classes[i]+'_24.png',
        iconSize: [24,24],
        iconAnchor: [12,24],
        popupAnchor: [0,-24]
      });

      marker_poi = L.marker(locations[i], {icon: locationIcon});
      marker_poi.bindPopup("<b>" + i18n.t('classes.class') + ": </b>" + splitClasses(classes[i], lang) + "<br><b>" + i18n.t('classes.rating') + ": </b>" + ratings[i] + "<br>" + attachImage(imageLength[i]) );  //  + isCommentEmpty(comments[i]) + isImageEmpty(ids[i], imageLength[i]));
      marker_poi.mydata='historical-cultural';
      markers_historical_cultural.addLayer(marker_poi);
    }
  }
  
  
  if (flag_allMarkers == true){
    for (var j = 0; j < odk.totalFeatures; j++) {
      if (odk.features[j].properties.tipo_e == "elemento storico-culturale") {
        if (odk.features[j].properties.tipo_e_2 == "edilizia civile" &&  chk[0].checked)
        iconUrl_odk = 'css/lib/images/markers_class/civil_building_24.png';
        else if (odk.features[j].properties.tipo_e_2 == "edilizia religiosa" &&  chk[1].checked)
        iconUrl_odk = 'css/lib/images/markers_class/religious_building_24.png';
        else if (odk.features[j].properties.tipo_e_2 == "edilizia militare" &&  chk[3].checked)
        iconUrl_odk = 'css/lib/images/markers_class/military_building_24.png';
        else if (odk.features[j].properties.tipo_e_2 == "museo" && chk[4].checked)
        iconUrl_odk = 'css/lib/images/markers_class/museum_24.png';
        else if (odk.features[j].properties.tipo_e_2 == "edilizia rurale" &&  chk[2].checked)
        iconUrl_odk = 'css/lib/images/markers_class/rural_building_24.png';
        else if (odk.features[j].properties.tipo_e_2 == "opifici" &&  chk[6].checked)
        iconUrl_odk = 'css/lib/images/markers_class/factory_24.png';
        else if (odk.features[j].properties.tipo_e_2 == "elemento d'interesse archeologico" &&  chk[5].checke)
        iconUrl_odk = 'css/lib/images/markers_class/archeological_element_24.png';
		else
			skipMarker = true;

		if(skipMarker == false){
			locationIcon = L.icon({
			  iconUrl: iconUrl_odk,
			  iconSize: [24,24],
			  iconAnchor: [12,24],
			  popupAnchor: [0,-24]
			});

			location = [odk.features[j].geometry.coordinates[1], odk.features[j].geometry.coordinates[0]];
			marker_poi = L.marker(location, {icon: locationIcon});
			marker_poi.bindPopup(("<div><b>" + i18n.t('classes.date') + ": </b>" + odk.features[j].properties.data + "<br><b>" + i18n.t('classes.user') + ": </b>" + odk.features[j].properties.tipo_utente + checkNullName(odk.features[j].properties.nome) + "<br><b>" + i18n.t('classes.group') + ": </b>" + odk.features[j].properties.tipo_e + checkNullClass(odk.features[j].properties.tipo_e_2) + checkNullSubclass(odk.features[j].properties.tipo_e_3) + "<br><br><center><img src='" + odk.features[j].properties.img_ref + "' width='200px'></center></div>"));
			marker_poi.mydata='historical-cultural';
			markers_historical_cultural.addLayer(marker_poi);
		}
		skipMarker = false;
      }
    }
  }

  map.addLayer(markers_historical_cultural);


  //morphological elements
  for (var i = 0; i < classes.length; i++) {
    if (classes[i] == 'support_for_traffic_artifacts' || classes[i] == 'bounding_escarpment' || classes[i] == 'surface') {
      locationIcon = L.icon({
        iconUrl: 'css/lib/images/markers_class/'+classes[i]+'_24.png',
        iconSize: [24,24],
        iconAnchor: [12,24],
        popupAnchor: [0,-24]
      });

      marker_poi = L.marker(locations[i], {icon: locationIcon});
      marker_poi.bindPopup("<b>" + i18n.t('classes.class') + ": </b>" + splitClasses(classes[i], lang) + "<br><b>" + i18n.t('classes.rating') + ": </b>" + ratings[i] + "<br>" + attachImage(imageLength[i]));
      marker_poi.mydata='morphological';
      markers_morphological.addLayer(marker_poi);
    }
  }

  if (flag_allMarkers == true){
    for (var j = 0; j < odk.totalFeatures; j++) {
      if (odk.features[j].properties.tipo_e == "elemento morfologico"  ) {
        if (odk.features[j].properties.tipo_e_2 == "superficie" &&  chk[9].checked)
        iconUrl_odk = 'css/lib/images/markers_class/surface_24.png';
        else if (odk.features[j].properties.tipo_e_2 == "delimitazione/scarpata"  && chk[8].checked)
        iconUrl_odk = 'css/lib/images/markers_class/bounding_escarpment_24.png';
        else if (odk.features[j].properties.tipo_e_2 == "supporto del traffico e manufatto"  &&  chk[7].checked)
        iconUrl_odk = 'css/lib/images/markers_class/support_for_traffic_artifacts_24.png';
		else
			skipMarker = true;

		if(skipMarker == false){
			locationIcon = L.icon({
			  iconUrl: iconUrl_odk,
			  iconSize: [24,24],
			  iconAnchor: [12,24],
			  popupAnchor: [0,-24]
			});

			location = [odk.features[j].geometry.coordinates[1], odk.features[j].geometry.coordinates[0]];
			marker_poi = L.marker(location, {icon: locationIcon});
			marker_poi.bindPopup("<div><b>" + i18n.t('classes.date') + ": </b>" + odk.features[j].properties.data + "<br><b>" + i18n.t('classes.user') + ": </b>" + odk.features[j].properties.tipo_utente + checkNullName(odk.features[j].properties.nome) + "<br><b>" + i18n.t('classes.group') + ": </b>" + odk.features[j].properties.tipo_e + checkNullClass(odk.features[j].properties.tipo_e_2) + checkNullSubclass(odk.features[j].properties.tipo_e_3) + "<br><br><center><img src='" + odk.features[j].properties.img_ref + "' width='200px'></center></div>");
			marker_poi.mydata='morphological';
			markers_morphological.addLayer(marker_poi);
		}
		skipMarker = false;
      }
    }
  }

  map.addLayer(markers_morphological);


  //touristic elements
  for (var i = 0; i < classes.length; i++) {
    if (classes[i] == 'transportation' || classes[i] == 'service' || classes[i] == 'accommodation_overnight' || classes[i] == 'food_service' || classes[i] == 'product') {
      locationIcon = L.icon({
        iconUrl: 'css/lib/images/markers_class/'+classes[i]+'_24.png',
        iconSize: [24,24],
        iconAnchor: [12,24],
        popupAnchor: [0,-24]
      });

      marker_poi = L.marker(locations[i], {icon: locationIcon});
      marker_poi.bindPopup("<b>" + i18n.t('classes.class') + ": </b>" + splitClasses(classes[i], lang) + "<br><b>" + i18n.t('classes.rating') + ": </b>" + ratings[i] + "<br>" + attachImage(imageLength[i]));
      marker_poi.mydata='touristic';
      markers_touristic.addLayer(marker_poi);
    }
  }

  if (flag_allMarkers == true){
    for (var j = 0; j < odk.totalFeatures; j++) {
      if (odk.features[j].properties.tipo_e == "elemento turistico"  ) {
        if (odk.features[j].properties.tipo_e_2 == "alloggio e pernottamento" && chk[12].checked)
        iconUrl_odk = 'css/lib/images/markers_class/accommodation_overnight_24.png';
        else if (odk.features[j].properties.tipo_e_2 == "servizi"  && chk[11].checked)
        iconUrl_odk = 'css/lib/images/markers_class/service_24.png';
        else if (odk.features[j].properties.tipo_e_2 == "trasporti"  &&  chk[10].checked)
        iconUrl_odk = 'css/lib/images/markers_class/transportation_24.png';
        else if (odk.features[j].properties.tipo_e_2 == "prodotti"  && chk[14].checked)
        iconUrl_odk = 'css/lib/images/markers_class/product_24.png';
        else if (odk.features[j].properties.tipo_e_2 == "ristorazione"  && chk[13].checked)
        iconUrl_odk = 'css/lib/images/markers_class/food_service_24.png';
		else
			skipMarker = true;

		if(skipMarker == false){
			locationIcon = L.icon({
			  iconUrl: iconUrl_odk,
			  iconSize: [24,24],
			  iconAnchor: [12,24],
			  popupAnchor: [0,-24]
			});

			location = [odk.features[j].geometry.coordinates[1], odk.features[j].geometry.coordinates[0]];
			marker_poi = L.marker(location, {icon: locationIcon});
			marker_poi.bindPopup("<div><b>" + i18n.t('classes.date') + ": </b>" + odk.features[j].properties.data + "<br><b>" + i18n.t('classes.user') + ": </b>" + odk.features[j].properties.tipo_utente + checkNullName(odk.features[j].properties.nome) + "<br><b>" + i18n.t('classes.group') + ": </b>" + odk.features[j].properties.tipo_e + checkNullClass(odk.features[j].properties.tipo_e_2) + checkNullSubclass(odk.features[j].properties.tipo_e_3) + "<br><br><center><img src='" + odk.features[j].properties.img_ref + "' width='200px'></center></div>");
			marker_poi.mydata='touristic';
			markers_touristic.addLayer(marker_poi);
		}
		skipMarker = false;
      }
    }
  }

  map.addLayer(markers_touristic);


  //critical elements
  for (var i = 0; i < classes.length; i++) {
    if (classes[i] == 'morphological_element' || classes[i] == 'structural_element') {
      locationIcon = L.icon({
        iconUrl: 'css/lib/images/markers_class/'+classes[i]+'_24.png',
        iconSize: [24,24],
        iconAnchor: [12,24],
        popupAnchor: [0,-24]
      });

      marker_poi = L.marker(locations[i], {icon: locationIcon});
      marker_poi.bindPopup("<b>" + i18n.t('classes.class') + ": </b>" + splitClasses(classes[i], lang) + "<br><b>" + i18n.t('classes.rating') + ": </b>" + ratings[i] + "<br>" + attachImage(imageLength[i]));
      marker_poi.mydata='critical';
      markers_critical.addLayer(marker_poi);
    }
  }

  if (flag_allMarkers == true){
    for (var j = 0; j < odk.totalFeatures; j++) {
      if (odk.features[j].properties.tipo_e == "elemento critico" ) {
        if (odk.features[j].properties.tipo_e_2 == "morfologico" && chk[15].checked)
        iconUrl_odk = 'css/lib/images/markers_class/morphological_element_24.png';
        else if (odk.features[j].properties.tipo_e_2 == "strutturale"  &&  chk[16].checked)
        iconUrl_odk = 'css/lib/images/markers_class/structural_element_24.png';
		else
			skipMarker = true;
		
		if(skipMarker == false){		
			locationIcon = L.icon({
			  iconUrl: iconUrl_odk,
			  iconSize: [24,24],
			  iconAnchor: [12,24],
			  popupAnchor: [0,-24]
			});

			location = [odk.features[j].geometry.coordinates[1], odk.features[j].geometry.coordinates[0]];
			marker_poi = L.marker(location, {icon: locationIcon});
			marker_poi.bindPopup("<div><b>" + i18n.t('classes.date') + ": </b>" + odk.features[j].properties.data + "<br><b>" + i18n.t('classes.user') + ": </b>" + odk.features[j].properties.tipo_utente + checkNullName(odk.features[j].properties.nome) + "<br><b>" + i18n.t('classes.group') + ": </b>" + odk.features[j].properties.tipo_e + checkNullClass(odk.features[j].properties.tipo_e_2) + checkNullSubclass(odk.features[j].properties.tipo_e_3) + "<br><br><center><img src='" + odk.features[j].properties.img_ref + "' width='200px'></center></div>");
			marker_poi.mydata='critical';
			markers_critical.addLayer(marker_poi);
		}
		skipMarker = false;
      }
    }
  }

  map.addLayer(markers_critical);


  return {
    markers_historical_cultural : markers_historical_cultural,
    markers_morphological : markers_morphological,
    markers_touristic : markers_touristic,
    markers_critical : markers_critical
  };
}

//generating status to be shown at the bottom for the map of "Everyone"
function generateStatusEveryone(curLoc, locations, classes, lang){
  var total_num=0;
  var dist;
  var latlng_current = L.latLng(curLoc[0], curLoc[1]);
  for (var i = 0; i < classes.length; i++) {
    dist=latlng_current.distanceTo(L.latLng(locations[i][0], locations[i][1]));
    if(dist<=5000){
      total_num++;
    }
  }
  //console.log(odk.totalFeatures);
  for (var j = 0; j < odk.totalFeatures; j++) {
    //console.log(j);
    //console.log(odk.features[j]);
    if(odk.features[j].geometry!=null){
      var location = [odk.features[j].geometry.coordinates[1], odk.features[j].geometry.coordinates[0]];
      dist=latlng_current.distanceTo(L.latLng(location[0], location[1]));
      if(dist<=5000){
        total_num++;
      }
    }
  }

  if (total_num==0){
    $("#allmap-stat").html(i18n.t('stat.nopoint-all') +"<br/><br/>");
  }
  else if (total_num==1){
    $("#allmap-stat").html(i18n.t('stat.total-all-single') + total_num + i18n.t('stat.contr-all-single') + "<br/><br/>");
  }
  else {
    $("#allmap-stat").html(i18n.t('stat.total-all-plural') + total_num + i18n.t('stat.contr-all-plural') + "<br/><br/>");
  }
  $("#allmap-stat").show();
}

//add legend: for my map and all map
function addLegend(lang){
	
  console.log("making legend");
  $('.leaflet-container').css({'line-height' : '0.5'});
  var innerhtml="";
  innerhtml +='<form><input id="osm" type="radio" name="basemap" checked><label for="osm" id="label_radio"> OpenStreetMap</label><br><input id="bing" type="radio" name="basemap"><label for="bing" id="label_radio">' + i18n.t('classes.bing') + '</label></form>';
  //console.log(dynamicLegend);
  innerhtml += dynamicLegend;
  $('.legend').append(innerhtml);
}

var legendH;

function adjustLegendH(){
  var mapH = $("#map").height();
  //console.log(mapH + "---" + legendH);

  if ((legendH+64) > mapH){
    $('div.legend').css('height', (mapH-70) + 'px');
    $('div.legend').css('overflow-y', 'auto');
  }
  else{
    $('div.legend').css('height', legendH);
    //console.log("inside else");
    $("div.legend").css("overflow-y", "visible");
  }
}

  
/*
function Add_markers_historical_cultural(){
};
*/

function addLegendButton(){
  $('#map').append('<div class="legend_b" style="position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,.5); border-radius: 0px; border:3px solid rgba(51,136,204,.3);"><img src="img/layers.png"></img></div>');

  $('div.legend_b').on("vclick", function(){
    //console.log("clicked!");
    $(".legend").toggle();
    //console.log($('div.legend')[0].scrollHeight);
    legendH = $('div.legend')[0].scrollHeight;

    adjustLegendH();
  });

  $('#bing').click(function(){
    //console.log("clicked on bing!");
    //networkState_browser = serverReachable();
    if (networkState == Connection.NONE || networkState_browser == false)
    navigator.notification.alert(i18n.t('messages.bing-noInternet'), null, "Via Regina", i18n.t('messages.ok'));
    else {
      map.removeLayer(tilelayer);
      map.addLayer(bing);
      //$('.legend').css('color', '#ffffff');
    }
  });

  $('#osm').click(function(){
    //console.log("clicked on osm!");
    if (map.hasLayer(bing))
    map.removeLayer(bing);
    map.removeLayer(tilelayer);

    //networkState_browser = serverReachable();

    if (networkState == Connection.NONE || networkState_browser == false){
      navigator.notification.alert(i18n.t('messages.osm-noInternet'), null, "Via Regina", i18n.t('messages.ok'));
      tilelayer = L.tileLayer('como_tiles/{z}/{x}/{y}.png', {
        errorTileUrl:'como_tiles/error-tile.png'
      });
    }
    else{
      tilelayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy;OpenStreetMap contributors.">',
        //minZoom:12,
        //maxZoom:17,
        subdomains:['a','b','c'],
        errorTileUrl:'como_tiles/error-tile.png'
      });
    }

    //tilelayer.bringToFront();
    map.addLayer(tilelayer);
    //$('.legend').css('color', '#555');
  });


  $("input[name=filter]").click(function(){
	//check how many checkbox is checked
	    //체크박스의 전체 개수
	len = chk.length;	
	var checkRow = '';      //체크된 체크박스의 value를 담기위한 변수
	var checkCnt = 0;        //체크된 체크박스의 개수
	var checkLast = '';      //체크된 체크박스 중 마지막 체크박스의 인덱스를 담기위한 변수
	var rowid = '';             //체크된 체크박스의 모든 value 값을 담는다
	var cnt = 0;                 
	
	for(var i=0; i<len; i++){
		if(chk[i].checked == true){
			checkCnt++;        //the number of checkbox
			//checkLast = i;     //체크된 체크박스의 인덱스
		}
	}
	//console.log("remove all mark" + checkCnt);
		
	if (markersAll) {
		map.removeLayer(markersAll.markers_historical_cultural);
		map.removeLayer(markersAll.markers_morphological);
		map.removeLayer(markersAll.markers_touristic);
		map.removeLayer(markersAll.markers_critical);
	}
	if (markersMy) {
		map.removeLayer(markersMy.markers_historical_cultural);
		map.removeLayer(markersMy.markers_morphological);
		map.removeLayer(markersMy.markers_touristic);
		map.removeLayer(markersMy.markers_critical);
	}
	
	db.allDocs({include_docs: true, descending: true}, function(err, doc) {
		if(err){
			return;
		}
		//process all docs
		var locations=[];
		var classes=[];
		var ratings = [];
		var comments = [];
		var ids=[];
		var imageLength=[];
		var ii = 0;
		doc.rows.forEach(function(todo) {
			for(var j = 0; j < len; j++){
				if(chk[j].checked == true){
					if(todo.doc.classification  == chk[j].id){
					  //console.log('success');
					  locations.push(todo.doc.location);
					  classes.push(todo.doc.classification);
					  ratings.push(todo.doc.rating);
					  comments.push(todo.doc.comment);
					  ids.push(todo.doc.deviceid);
					  //imageLength.push(todo.doc.img["image.jpg"].length);
					  ii++;
					}
				}
			}
		});
	
		//console.log(flag_allMarkers);
		if(flag_allMarkers == false)
			markersMy = vizPOIs(map, odk, locations, classes, ratings, comments, ids, imageLength, ln.language.code);
		else{
			//filtering = true;
			markersAll = vizPOIs(map, odk, locations, classes, ratings, comments, ids, imageLength, ln.language.code);
			generateStatusEveryone(curLatLng, locations, classes, ln.language.code);
			//filtering = false;
		}
	});
	
  });
  
}

function resize(){
  //resize map to cover whole screen
  var mapEl = $('#map');
  mapEl.height($(document).height() - mapEl.offset().top);
  var mapEl = $('.tabs');
  mapEl.height($(document).height() - mapEl.offset().top);

  adjustLegendH();
}
