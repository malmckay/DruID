/* /Developer/AdobeAIRSDK/bin/adt -certificate -cn 'DruID' -o 'Mal McKay' -c 'US' 2048-RSA ../cert.p12 */
/*/Developer/AdobeAIRSDK/bin/adt -package -storetype pkcs12 -keystore ../cert.p12 DruID.air DruID-app.xml .*/
/*/Developer/AdobeAIRSDK/bin/adt -package -storetype pkcs12 -keystore ../cert.p12 SpaID.air SpaID-app.xml .*/

Ext.BLANK_IMAGE_URL = '/ext-3.0.0/resources/images/default/s.gif';
Ext.onReady(appLoad);

function appLoad(){
    setupTabs();
    setupCopy();
    setupDragDrop();
    setupGrids();
    setupNetworkData();
	reparseDupes();

	var appUpdater = new runtime.air.update.ApplicationUpdaterUI();
	appUpdater.configurationFile = new air.File("app:/updateConfig.xml");
	appUpdater.initialize();
}
function doDrop(e){
    timer(function (){
        tabPanel.getItem("ResultsPanel").show();

        // dataTransfer.dropEffect
        if((e.dataTransfer.types.toString()).search("application/x-vnd.adobe.air.file-list") > -1){
            var fileList = e.dataTransfer.getData("application/x-vnd.adobe.air.file-list");
            currentFile = fileList[0];
            fileList.map(parseFile)
        }
        if((e.dataTransfer.types.toString()).search("text/plain") > -1){
            var text = e.dataTransfer.getData("text/plain");
            extractStrains(text, "Unnamed Sequence")
        }
    })
}
function trim(str){return Ext.util.Format.trim(str);}
function getFileContents(file){
    var fs = new air.FileStream();
    fs.open(file, air.FileMode.READ)
    str = fs.readUTFBytes(fs.bytesAvailable);
    fs.close();
    return str;
}
function writeFileContents(file, data){
    var fs = new air.FileStream();
    fs.open(file, air.FileMode.WRITE)
    str = fs.writeUTFBytes(data);
    fs.close();
    return str;
}
function addError(str){
    errorStore.loadData([[str]],true)
}
function traceTime(){
    var now = new Date();
    air.trace(now)
}
function timer(func){
    traceTime();
    func();
    traceTime();
}
function extractStrains(data, filename){
    var sequences = parseFasta(data, filename);
    // air.trace("sequences-------------")
    // air.trace(sequences[0].sequence)
    // air.trace("sequences-------------")
    sequences.map(parseStrain)
}

function isFasta(data){
    return data[0] == '>' && /[ACGTN*-]+/im.test(trim(data));
}
function isStrain(data){
    return /[ACGTN*-]+/im.test(trim(data));
}

function parseFile(file){
    if(file.isDirectory){
        file.getDirectoryListing().map(parseFile)
    }else{
        str = getFileContents(file);
        var parsed = extractStrains(str, file.name);
        if(parsed){
            fileStore.loadData([[file.url]],true)
        }
    }
}
function parseStrain(packet){
    var result = parseDruRepeats(packet);
    if(result.found){
        packet.repeats = result.repeats;
        strainStore.loadData([[">"+packet.name, packet.sequence, packet.repeats.join('-'), result.druType]],true)
        displayingResults = true;
    }else{
        strainStore.loadData([[">"+packet.name, packet.sequence, result.message]],true)
        var packet2 = {name:name, sequence:reversed(complement(packet.sequence)), reversed:true};
		// air.trace(packet2.sequence)
        result = parseDruRepeats(packet2);
        if(result.found){
            strainStore.loadData([[">"+packet.name + " (reverse-complemented)", packet2.sequence, result.repeats.join('-'), result.druType]],true)
            displayingResults = true;
        }
    }
}

function parseDruRepeats(packet){
	var matches  = []
	DruRepeats.forEach(function (rep){
		var current_index = packet.sequence.indexOf(rep.sequence);
		while(current_index >=0 ){
			matches.push({name:rep.name,sequence:rep.sequence,position:current_index});
			current_index = packet.sequence.indexOf(rep.sequence, current_index+rep.sequence.length);
		}
	});

	if(matches.length > 0){
		var unknowns = [];

		//BUGFIX for truncated
		OverlapRepeats.forEach(function (dupe_arr){
			keep = dupe_arr[0];
			remove = dupe_arr[1];
			supersets = matches.filter(function (ele){return ele.name == keep})
			supersets.forEach(function (superset){
				matches = matches.filter(function (rep){
					if((rep.position < superset.position) || (rep.position > (superset.position+superset.sequence.length))){
						return true;
					}
					if(!remove.some(function (sub_remove){return rep.name==sub_remove})){
						return true;
					}
					return false;
				});
			});

		});
		var sorted_matches = matches.sort(function (repA,repB){return repA.position - repB.position})

		next_start_pos = sorted_matches[0].position
		sorted_matches.forEach(function (rep){
			if(rep.position != next_start_pos){
				seq = packet.sequence.slice(next_start_pos,(rep.position-1))
				matches.push({name:'??',sequence:seq,position:next_start_pos})
			}
			next_start_pos = rep.position + rep.sequence.length
		})
		var re_sorted_matches = matches.sort(function (repA,repB){return repA.position - repB.position})
		var repeats           = re_sorted_matches.map(function (rep){return rep.name})
		var repeats_type      = repeats.filter(function (txt){return txt.length<=2})

	    var search = repeats_type.join('-')
	    var drutype = 'unknown';
	    var drutypes = DruTypes.filter(function (dru_type){return search == dru_type.drutype});
	    if(drutypes.length > 0){
	        drutype = drutypes[0].name;
	    }
        return {found:true, repeats:repeats, druType:drutype};
	}else{
		return {found:false, message:"Error for "+packet.name+": Start fragment not found. "};
	}
}
