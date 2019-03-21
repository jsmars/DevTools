//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Photoshop Script: Save PNG Copy
// Made by: Jonathan Smårs / jsmars.com / jsmars@gmail.com
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// This script will save an extra PNG file in the same directory when saving as PSD and any layer has the phrase "PNG" in it
// Also, any layers containing HIDE in their name will be hidden for the PNG file, use this for backgrounds, helpers, etc
// To enable, go to File-Scripts-Scripts Event Manager, Enable scripts and add this script on "Save Document"
//
// In addition, any layer (or folder) containing .png, will be saved out as a seperate file with that exact name.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

main(); 
function main()
{ 
	var Ext = decodeURI(app.activeDocument.name).replace(/^.*\./,''); 
	var doc = app.activeDocument;
	
	// Only run when saving as PSD
	if(Ext.toLowerCase() != 'psd') 
		return; 
	
	var Name = app.activeDocument.name.replace(/\.[^\.]+$/, ''); 
	
	// Hide any visible layers containing the string HIDE in the name
    var hidden = [];
    var foundPNG = false;
	for (var i = 0; i < doc.layers.length; i++)
	{
        var item = doc.layers[i];
		var name = item.name.toLowerCase();
        if (name.indexOf("png") >= 0 && name.indexOf(".png") < 0)
            foundPNG = true;
		if (item.visible && item.name.toLowerCase().indexOf("hide") >= 0)
		{
			hidden.push(item);
			item.visible = false;
		}
    }

    // only run script if there is the phrase PNG (not .png) in some layer
    if (foundPNG) 
		replacePNG(Name + ".png");
	
	// Now loop through and see if we have any .PNG layers to save individually
	
	// first collect separate layers that want to be saved
	var seperate = [];
	for (var i = 0; i < doc.layers.length; i++)
        if (doc.layers[i].name.toLowerCase().indexOf(".png") >= 0)
			seperate.push(doc.layers[i]);
		
	if (seperate.length > 0)
	{
		var hidden2 = [];
		for (var i = 0; i < seperate.length; i++)
		{
			var parent = seperate[i];
			var vis = parent.visible;
			parent.visible = true;
			for (var k = 0; k < doc.layers.length; k++) // hide all other layers not in this layer
			{
				var item = doc.layers[k];
				if (item.visible && item != parent && !isChildOf(item, parent))
				{
					item.visible = false;
					hidden2.push(item);
				}
			}
			replacePNG(parent.name);
			parent.visible = vis;
			showAll(hidden2);
		}
	}
		
	showAll(hidden); // Show hidden 'HIDE' layers again
	activeDocument.save(); // Save the PSD file so that it doesn't show up as changed
} 

var safe = 0;
function isChildOf(child, parent)
{
	safe++;
	if (safe > 25)
		return false;
	
	if (child.parent == null || child.parent == app.activeDocument)
	{
		safe = 0;
		return false;
	}
	if (child.parent == parent)
	{
		safe = 0;
		return true;
	}
	return isChildOf(child.parent, parent);
}

function replacePNG(filename)
{
	var saveFile = File(app.activeDocument.path + "/" + filename); 
	
	if (saveFile.exists)  
		saveFile.remove(); 
	activeDocument.saveAs(saveFile, new PNGSaveOptions(), true, Extension.LOWERCASE);
}

function showAll(arr)
{
    for (var i = 0; i < arr.length; i++)
        arr[i].visible = true;
}