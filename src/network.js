/*http://www.dru-typing.org/downloads/drurepeats.txt
http://www.dru-typing.org/downloads/drutypes.txt
*/
var loadingMessage;
var loadingSep;

function loadNetworkData(url, handler){
    var loader = new air.URLLoader();
    loader.dataFormat = air.URLLoaderDataFormat.TEXT;
    loader.addEventListener(air.Event.COMPLETE, handler);
    try{
        loader.load(new air.URLRequest(url));
    }catch(error) {air.trace("Unable to load URL: " + error); }

}


function setupNetworkData(){
    tip = {xtype: 'tbtext', text: 'Loading data...'};
    strainGrid.getTopToolbar().addItem({xtype: 'tbseparator'});
    strainGrid.getTopToolbar().addItem(tip);

    tabPanel.doLayout();
    statusText('Loading Repeats')
    loadNetworkData("http://spa.ridom.de/dynamic/sparepeats.fasta",completeHandlerNewRepeats);
    statusText('Loading Types')
    loadNetworkData("http://spa.ridom.de/dynamic/spatypes.txt",completeHandlerNewTypes);
}

function completeHandlerNewRepeats(event) {
    var loader = event.target;
    var data = loader.data;
    var newSequences = parseFasta(data)
    newSequences.map(updateDruRepeats)
	var tip = null;
    if(addedNewRepeats > 0){
        tip = {xtype: 'tbtext', text: DruRepeats.length + ' Repeats in the database. <i>Downloaded '+addedNewRepeats+' Repeats</i>'};
    }else{
        tip = {xtype: 'tbtext', text: DruRepeats.length + ' Repeats in the database. <i>No new Repeats found on dru-typing.org.</i>'};
	}
    strainGrid.getTopToolbar().addItem({xtype: 'tbseparator'})
    strainGrid.getTopToolbar().addItem(tip)
    strainGrid.getTopToolbar().remove(loadingMessage);
    strainGrid.getTopToolbar().remove(loadingSep);
    tabPanel.doLayout()
}

function completeHandlerNewTypes(event) {
    var loader = event.target;
    var newTypes = loader.data.split(/\r|\n/);
    newTypes = newTypes.filter(isNotBlank).map(function (s){return s.split(",")})
    newTypes.map(updateDruTypes)
	var tip = null;
    if(addedNewTypes > 0){
        tip = {xtype: 'tbtext', text: DruTypes.length + ' Types in the database. <i>Downloaded '+addedNewTypes+' Types</i>'};
    }else{
        tip = {xtype: 'tbtext', text: DruTypes.length + ' Types in the database. <i>No new Types found on dru-typing.org</i>'};
	}

    strainGrid.getTopToolbar().addItem({xtype: 'tbseparator'});
    strainGrid.getTopToolbar().addItem(tip);
    statusText('Ready')
    tabPanel.doLayout();
	reparseDupes();
}

function updateDruRepeats(packet){
    if(!has(DruRepeats,"name",packet.name.substring(1,99))){
        DruRepeats.push({name:packet.name.substring(1,99),sequence:packet.sequence})
        addedNewRepeats++;
    }
}

function updateDruTypes(packet){
    if(!has(DruTypes,"name",packet[0])){
        DruTypes.push({name:packet[0],drutype:packet[1]})
        addedNewTypes++;
    }
}

function has(arr, field, value){
     return arr.some(function (item){
        return item[field]==value
    })
}

function statusText(msg){
    strainGrid.getTopToolbar().items.itemAt(4).setText(msg)
}

