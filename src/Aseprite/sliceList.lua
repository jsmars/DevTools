-- Creates a list of all the document slices
-- Sadly no support for animations yet since that isn't exposed in the API (?)
-- Script by Jonathan Smårs, check out my development on twitter @jsmars and my website jsmars.com

if not app.activeSprite then return app.alert "There is no active sprite" end

local dlg = Dialog("Slice List")

local count = 0;
for a,slice in ipairs(app.activeSprite.slices) do
	count = count + 1
	dlg:label{ label = "Name", text = slice.name }
	dlg:label{ label = "Bounds", text = "x: " .. slice.bounds.x .. ", y: " .. slice.bounds.y .. ", w: " .. slice.bounds.width .. ", h: " .. slice.bounds.height }
	if slice.center ~= nil then 
		dlg:label{ label = "Center", text = "x: " .. slice.center.x .. ", y: " .. slice.center.y .. ", w: " .. slice.center.width .. ", h: " .. slice.center.height } end
	if slice.pivot ~= nil then 
		dlg:label{ label = "Pivot", text = "x: " .. slice.pivot.x .. ", y: " .. slice.pivot.y } end
	dlg:label{ label = "Data", text = slice.data }
	
	dlg:button{ text = "Delete", onclick= function() 
		app.activeSprite:deleteSlice(slice) 
		end }
end
if count == 0 then
	dlg:label{ label = "Sprite contains no slices" } end

dlg:show{}