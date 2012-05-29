var displayingResults = false;
var addedNewRepeats = 0;
var addedNewTypes = 0;

var errorStore;
var strainStore;
var fileStore;

var errorGrid;
var strainGrid;
var fileGrid;


function setupDragDrop(){
  var target = document.getElementById('app-body'); 
  target.addEventListener("dragenter", function (e){e.preventDefault();}); 
  target.addEventListener("dragover",  function (e){e.preventDefault();}); 
  target.addEventListener("drop", doDrop);
}

function setupGrids(){
    var res

    res = setupStrainGrid('strainList','strain','Sequence');
    strainGrid = res[0]
    strainStore = res[1]

    res = setupGrid('fileList','file','Files');
    fileGrid = res[0]
    fileStore = res[1]

    res = setupGrid('errorList','message','Error Messages');
    errorGrid = res[0]
    errorStore = res[1]
}

function setupGrid(domId, fieldId, fieldName){
    // create the data store
    var store = new Ext.data.ArrayStore({fields: [{name: fieldId}]});
    store.loadData([]);

    // create the Grid
    var grid = new Ext.grid.GridPanel({
        store: store,
        columns: [
            {id:fieldId,header: fieldName, width: 160, sortable: true, dataIndex: fieldId}
        ],
        autoExpandColumn: fieldId,
        height:100,
        width:"90%"
    });
/*    grid.render(domId);*/
tabPanel.getItem("ResultsPanel").add(grid)
tabPanel.doLayout()
    return [grid, store];
}
function setupStrainGrid(domId, fieldId, fieldName){
    // create the data store
    var store = new Ext.data.ArrayStore({fields: [{name: 'name'}, {name: fieldId}, {name: 'druRepeats'}, {name: 'druType'}]});
    store.loadData([]);

    // create the Grid
    var grid = new Ext.grid.EditorGridPanel({
        store: store,
        columns: [
            {id:'name',header: 'Name', width: 160, sortable: true, dataIndex: 'name'},
            {id:fieldId,header: fieldName, width: 120, sortable: true, dataIndex: fieldId},
            {id:'druRepeats',header: 'Spa Repeats', width: 160, sortable: true, dataIndex: 'druRepeats',
            editor: new Ext.form.TextField({allowBlank: false})},
            {id:'druType',header: 'Spa Type', width: 120, sortable: true, dataIndex: 'druType',
            editor: new Ext.form.TextField({allowBlank: false})}
        ],
        autoExpandColumn: 'druRepeats',
        height:240,
        width:"90%",
        tbar: [{
            text: 'Save Results As...',
            iconCls: 'silk-excel',
            handler: saveAs
        }, '-', {
            text: 'Clear Results',
            iconCls: 'silk-delete',
            handler: clearAll
        }],
    });
    tabPanel.getItem("ResultsPanel").add(grid)
    tabPanel.doLayout()
/*    grid.render(domId);*/
    return [grid, store];
}

function reparseDupes(){
	OverlapRepeats = [];
	DruRepeats.forEach(function (rep){
		var rep_length = rep.sequence.length
		subs = DruRepeats.filter(function (subrep){return (subrep.sequence.length < rep_length) && (rep.sequence.indexOf(subrep.sequence) >= 0)});
		if(subs.length > 0){
			OverlapRepeats.push([rep.name, subs.map(function (subrep){return subrep.name})]);
		}
	});
}



/*!
 * Ext JS Library 3.0+
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
 
 var tabPanel;
function setupTabs(){
    // basic tabs 1, built from existing content
/*    var tabs = new Ext.TabPanel({
        renderTo: 'tabs1',
        width:450,
        activeTab: 0,
        frame:true,
        defaults:{autoHeight: true},
        items:[
            {contentEl:'script', title: 'Short Text'},
            {contentEl:'markup', title: 'Long Text'}
        ]
    });

*/    // second tabs built from JS
    tabPanel = new Ext.TabPanel({
        renderTo: document.body,
        activeTab: 0,
        width:"100%",
        height:600,
        defaults:{autoScroll: true},
        items:[
        {
        id: "ResultsPanel",
        title: 'Results',
        bodyStyle:"background-color:#e0e0e0;"
        },
        {
        id: "HelpPanel",
        title: 'Help',
        bodyStyle:"background-color:#e0e0e0;padding:20px;",
        contentEl:"helpmenu"
        }
        ]
    });

}