function setupCopy(){
/*    applyTo:'exportButton', */
/*var buttonObject = new Ext.Button({text:'Save Results As...',handler:saveAs});
buttonObject.render('exportButton');
buttonObject = new Ext.Button({text:'Clear Results',handler:clearAll});
*//*buttonObject.render('clearButton');*/
/*alert(tabPanel)*/
/*tabPanel.getItem("NormalD").add(buttonObject)
tabPanel.doLayout()

*//*    var target = document.getElementById('app-body'); 
    target.addEventListener("copy", function (e){e.preventDefault();alert(e)}); 
*//*    var target = document.getElementById('app-body'); 
    target.addEventListener("copy", function (e){e.preventDefault();}); 
*/
} /*
private function keyListener(event:KeyboardEvent):void{ 
    if(event.ctrlKey){ 
        event.preventDefault(); 
        switch(String.fromCharCode(event.charCode)){ 
            case "c": 
                NativeApplication.nativeApplication.copy(); 
                break; 
            case "x": 
                NativeApplication.nativeApplication.cut(); 
                break; 
            case "v": 
                NativeApplication.nativeApplication.paste(); 
                break; 
            case "a": 
                NativeApplication.nativeApplication.selectAll(); 
                break; 
            case "z": 
                NativeApplication.nativeApplication.undo(); 
                break; 
            case "y": 
                NativeApplication.nativeApplication.redo(); 
                break; 
        } 
    } 
}*/
function clearAll(){
    strainStore.removeAll();
    fileStore.removeAll();
    errorStore.removeAll();
    displayingResults = false;
}
var currentFile;
function saveAs(){
    if(strainStore.getTotalCount() == 0){
        alert('No results to export');
        return;
    }
    var fileChooser = new air.File();
    if(currentFile){
        fileChooser= new air.File(currentFile.url + ".log.csv")
    }
/*    if (currentFile){
          fileChooser = currentFile;
    }else{
          fileChooser = defaultDirectory;
    }
*/  
    fileChooser.addEventListener("select", saveAsFileSelected);
    fileChooser.browseForSave("Save As");
}
function saveAsFileSelected(e){
     currentFile = e.target;
     var str = "name,dru type,dru repeats,strain\n";
     strainStore.each(function (record){str+=recordToRow(record)});
     writeFileContents(currentFile,str);
     return;
/*     saveFile();
     dataChanged = false;
     currentFile.removeEventListener(Event.SELECT, saveAsFileSelected);
*/
}
function recordToRow(record){
    return record.get('name')+","+record.get('druType')+","+record.get('druRepeats')+","+record.get('strain')+","+"\n";    
}