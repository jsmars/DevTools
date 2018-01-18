//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Photoshop Script: Save PNG Copy
// Made by: Jonathan Smårs / jsmars.com / jsmars@gmail.com
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// This script will save an extra PNG file in the same directory when saving as PSD
// Also, any layers containing HIDE in their name will be hidden for the PNG file, use this for backgrounds, helpers, etc
// To enable, go to File-Scripts-Scripts Event Manager, Enable scripts and add this script on "Save Document"
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

main(); 
function main()
{ 
	var Ext = decodeURI(app.activeDocument.name).replace(/^.*\./,''); 
	
	// Only run when saving as PSD
	if(Ext.toLowerCase() != 'psd') 
		return; 
	
	var Name = app.activeDocument.name.replace(/\.[^\.]+$/, ''); 
	var saveFile = File(app.activeDocument.path + "/" + Name +".png"); 
	
	// Remove if file already exists
	if(saveFile.exists) 
		saveFile.remove(); 
	
	// Hide any visible layers containing the string HIDE in the name
	var doc = app.activeDocument;
	var hidden = [];
	for (var i = 0; i < doc.layers.length; i++)
	{
		var item = doc.layers[i];
		if (item.visible && item.name.indexOf("HIDE") >= 0)
		{
			hidden.push(item);
			item.visible = false;
		}
	}

	// Save the file
	pngSaveOptions = new PNGSaveOptions(); 
	activeDocument.saveAs(saveFile, pngSaveOptions, true, Extension.LOWERCASE); 

	// Show hidden layers again
	for (var i = 0; i < hidden.length; i++)
		hidden[i].visible = true;
} 